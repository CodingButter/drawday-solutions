(() => {
  // Define snap positions
  type SnapPosition = {
    key: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };

  const snapPositions: SnapPosition[] = [
    { key: 'top-left', top: '20px', left: '20px' },
    { key: 'top-center', top: '20px', left: '50%' },
    { key: 'top-right', top: '20px', right: '20px' },
    { key: 'right-center', top: '50%', right: '20px' },
    { key: 'bottom-right', bottom: '20px', right: '20px' }, // Default
    { key: 'bottom-center', bottom: '20px', left: '50%' },
    { key: 'bottom-left', bottom: '20px', left: '20px' },
    { key: 'left-center', top: '50%', left: '20px' },
  ];

  // Create floating button with invisible hover area
  const container = document.createElement('div');
  container.id = 'drawday-sidepanel-container';

  const button = document.createElement('button');
  button.id = 'drawday-sidepanel-toggle';

  // Style the container (acts as hover area)
  const setContainerStyle = (position: SnapPosition) => {
    const containerStyles = `
      position: fixed;
      width: 80px;
      height: 80px;
      z-index: 2147483646;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      top: ${position.top ? `calc(${position.top} - 20px)` : 'auto'};
      bottom: ${position.bottom ? `calc(${position.bottom} - 20px)` : 'auto'};
      left: ${position.left === '50%' ? 'calc(50% - 40px)' : position.left ? `calc(${position.left} - 20px)` : 'auto'};
      right: ${position.right ? `calc(${position.right} - 20px)` : 'auto'};
    `;

    container.style.cssText = containerStyles;
  };

  // Style the button - invisible by default
  const setButtonStyle = (isDragging = false) => {
    const buttonStyles = `
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #764ba2;
      border: 2px solid #764ba2;
      cursor: ${isDragging ? 'grabbing' : 'pointer'};
      opacity: 0;
      transition: ${isDragging ? 'none' : 'opacity 0.3s ease'};
      box-shadow: ${isDragging ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'};
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      user-select: none;
      pointer-events: auto;
    `;

    button.style.cssText = buttonStyles;
  };

  // Add DrawDay logo
  const logoUrl = chrome.runtime.getURL('icon-32.png');
  button.innerHTML = `<img src="${logoUrl}" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none;" alt="DrawDay">`;

  // Initialize position
  let currentPosition: SnapPosition = snapPositions[4]; // Default to bottom-right

  // Timers
  let showTimeout: number | null = null;
  let hideTimeout: number | null = null;
  let isVisible = false;
  let isHovering = false;

  // Container hover handling with 1 second delay
  container.addEventListener('mouseenter', () => {
    isHovering = true;

    // Clear any hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    // Clear any existing show timeout
    if (showTimeout) {
      clearTimeout(showTimeout);
    }

    // Wait 1 second before showing
    showTimeout = window.setTimeout(() => {
      button.style.opacity = '1';
      isVisible = true;
      showTimeout = null;
    }, 1000);
  });

  container.addEventListener('mouseleave', () => {
    isHovering = false;

    // Clear show timeout if still waiting
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }

    // Only hide if button is visible
    if (isVisible) {
      hideTimeout = window.setTimeout(() => {
        button.style.opacity = '0';
        isVisible = false;
        hideTimeout = null;
      }, 1500);
    }
  });

  // Initialize styles
  setButtonStyle();
  setContainerStyle(currentPosition);

  // Load saved position
  chrome.storage.sync.get(['buttonPosition'], (result) => {
    if (result.buttonPosition) {
      const savedPosition = snapPositions.find((p) => p.key === result.buttonPosition);
      if (savedPosition) {
        currentPosition = savedPosition;
        setContainerStyle(currentPosition);
      }
    }
  });

  // Find nearest snap position
  const findNearestSnapPosition = (x: number, y: number): SnapPosition => {
    const threshold = 100;
    let nearest = currentPosition;
    let minDistance = Infinity;

    snapPositions.forEach((pos) => {
      let posX: number, posY: number;

      if (pos.left === '50%') {
        posX = window.innerWidth / 2;
      } else if (pos.left) {
        posX = parseInt(pos.left);
      } else if (pos.right) {
        posX = window.innerWidth - parseInt(pos.right);
      } else {
        posX = 0;
      }

      if (pos.top === '50%') {
        posY = window.innerHeight / 2;
      } else if (pos.top) {
        posY = parseInt(pos.top);
      } else if (pos.bottom) {
        posY = window.innerHeight - parseInt(pos.bottom);
      } else {
        posY = 0;
      }

      const distance = Math.sqrt(Math.pow(x - posX, 2) + Math.pow(y - posY, 2));

      if (distance < threshold && distance < minDistance) {
        minDistance = distance;
        nearest = pos;
      }
    });

    return nearest;
  };

  // Toggle side panel function
  const toggleSidePanel = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'toggleSidePanel',
      });

      if (response && response.success) {
        if (response.isOpen) {
          button.style.borderColor = '#667eea';
          button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        } else {
          button.style.borderColor = '#764ba2';
          button.style.background = '#764ba2';
        }
      }
    } catch (error) {
      console.error('Failed to toggle side panel:', error);
    }
  };

  // Combined drag and click handling
  button.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;

    // Make button visible immediately when interacting
    button.style.opacity = '1';
    isVisible = true;

    let hasMoved = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = container.getBoundingClientRect();
    const containerStartX = rect.left + rect.width / 2;
    const containerStartY = rect.top + rect.height / 2;

    let ghost: HTMLElement | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (!hasMoved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
        hasMoved = true;

        ghost = button.cloneNode(true) as HTMLElement;
        ghost.id = 'drawday-sidepanel-ghost';
        ghost.style.opacity = '0.3';
        ghost.style.pointerEvents = 'none';
        ghost.style.position = 'fixed';
        ghost.style.zIndex = '2147483645';
        document.body.appendChild(ghost);

        button.style.cursor = 'grabbing';
        button.style.opacity = '0.7';
        button.style.transition = 'none';

        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }
      }

      if (hasMoved) {
        const newX = containerStartX + deltaX;
        const newY = containerStartY + deltaY;

        container.style.transition = 'none';
        container.style.top = `${newY - 40}px`;
        container.style.bottom = 'auto';
        container.style.left = `${newX - 40}px`;
        container.style.right = 'auto';

        if (ghost) {
          const snapPos = findNearestSnapPosition(newX, newY);
          ghost.style.width = '40px';
          ghost.style.height = '40px';
          ghost.style.borderRadius = '50%';
          ghost.style.background = '#764ba2';
          ghost.style.border = '2px dashed #667eea';
          ghost.style.padding = '6px';

          if (snapPos.left === '50%' || snapPos.top === '50%') {
            ghost.style.transform = 'translate(-50%, -50%)';
          } else {
            ghost.style.transform = 'none';
          }

          ghost.style.top = snapPos.top || 'auto';
          ghost.style.bottom = snapPos.bottom || 'auto';
          ghost.style.left = snapPos.left || 'auto';
          ghost.style.right = snapPos.right || 'auto';
        }
      }
    };

    const onMouseUp = async (e: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (ghost) {
        ghost.remove();
      }

      if (hasMoved) {
        const finalX = containerStartX + (e.clientX - startX);
        const finalY = containerStartY + (e.clientY - startY);
        const snapPos = findNearestSnapPosition(finalX, finalY);

        currentPosition = snapPos;

        container.style.transition = 'all 0.3s ease';
        setContainerStyle(currentPosition);

        chrome.storage.sync.set({ buttonPosition: snapPos.key });

        setTimeout(() => {
          button.style.cursor = 'pointer';
          button.style.opacity = '1';
          button.style.transition = 'opacity 0.3s ease';

          if (!isHovering) {
            hideTimeout = window.setTimeout(() => {
              button.style.opacity = '0';
              isVisible = false;
            }, 1500);
          }
        }, 300);
      } else {
        await toggleSidePanel();

        // Keep visible for a moment after clicking
        setTimeout(() => {
          if (!isHovering) {
            button.style.opacity = '0';
            isVisible = false;
          }
        }, 500);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Add button to container
  container.appendChild(button);

  // Add container to page
  document.body.appendChild(container);

  // Clean up on navigation
  window.addEventListener('beforeunload', () => {
    container.remove();
  });
})();
