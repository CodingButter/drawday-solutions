export const helpContent = {
  competitionSelector: {
    title: 'Competition Selection',
    description: 'Choose the competition to run the raffle for',
    details: {
      content: 'Select from your imported competitions. Each competition contains its own set of participants and winners.',
    },
  },
  spinnerSettings: {
    spinDuration: {
      title: 'Spin Duration',
      description: 'How long the spinner rotates at maximum speed',
      details: {
        content: 'This controls how long the spinner maintains maximum speed before beginning to decelerate. The spinner always rotates at 5 rotations per second during this phase.',
        tips: [
          'Short: 2 seconds (10 rotations) - Quick draws',
          'Medium: 3 seconds (15 rotations) - Standard draws',
          'Long: 5 seconds (25 rotations) - Maximum suspense',
        ],
      },
    },
    decelerationSpeed: {
      title: 'Deceleration Speed',
      description: 'How quickly the wheel slows down',
      details: {
        content: 'This affects how rapidly the spinner decelerates after the spin duration. The deceleration phase uses mathematical easing for smooth, predictable results.',
        tips: [
          'Slow: Gradual slowdown for maximum suspense',
          'Medium: Balanced for most uses',
          'Fast: Quick resolution for rapid draws',
        ],
      },
    },
    minSpinDuration: {
      title: 'Minimum Spin Duration',
      description: 'Sets the minimum time the spinner will rotate',
      details: {
        content: 'This controls how long the spinner will spin before starting to slow down. Longer durations create more suspense.',
        tips: [
          'Default: 3 seconds',
          'Range: 1-10 seconds',
          'Longer durations work better for larger audiences',
        ],
      },
    },
    decelerationRate: {
      title: 'Deceleration Rate',
      description: 'Controls how quickly the spinner slows down',
      details: {
        content: 'This affects how the spinner slows to a stop. Slower deceleration creates more dramatic endings.',
        tips: [
          'Slow: Gradual slowdown for maximum suspense',
          'Medium: Balanced for most uses',
          'Fast: Quick resolution for rapid draws',
        ],
      },
    },
  },
  csvImport: {
    columnMapping: {
      title: 'Column Mapping',
      description: 'Map your CSV columns to the required fields',
      details: {
        content: 'Tell us which columns contain the participant information. The system will try to detect these automatically.',
        tips: [
          'First Name and Last Name, or Full Name are required',
          'Ticket Number is required and must be unique',
          'Save mappings for reuse with similar files',
        ],
      },
    },
    duplicateHandling: {
      title: 'Duplicate Tickets',
      description: 'Handle duplicate ticket numbers in your CSV',
      details: {
        content: 'When duplicate ticket numbers are found, you can choose how to handle them.',
        tips: [
          'Keep First: Use the first occurrence only',
          'Review: See all duplicates before deciding',
          'Cancel: Stop the import process',
        ],
      },
    },
  },
  savedMappings: {
    title: 'Saved Column Mappings',
    description: 'Reuse column mappings for similar CSV files',
    details: {
      content: 'Save your column mappings to quickly import similar CSV files in the future.',
      tips: [
        'Give mappings descriptive names',
        'Mappings are automatically suggested for similar files',
        'Delete unused mappings to keep the list clean',
      ],
    },
  },
  competitions: {
    overview: {
      title: 'Competition Management',
      description: 'Import and manage your raffle competitions',
      details: {
        content: 'Import participant lists from CSV files and manage multiple competitions.',
        tips: [
          'Each competition maintains its own participant list',
          'Competition-specific banners override default branding',
          'Delete competitions when no longer needed',
        ],
      },
    },
    csvUpload: {
      title: 'CSV File Upload',
      description: 'Upload participant lists from CSV files',
      details: {
        content: 'Import your participant data from CSV files. The system will automatically detect column headers.',
        tips: [
          'Supported formats: CSV, comma-separated values',
          'First row should contain column headers',
          'Maximum file size: 10MB',
        ],
      },
    },
  },
  competitionManagement: {
    title: 'Competition Management',
    description: 'Import and manage your raffle competitions',
    details: {
      content: 'Import participant lists from CSV files and manage multiple competitions.',
      tips: [
        'Each competition maintains its own participant list',
        'Competition-specific banners override default branding',
        'Delete competitions when no longer needed',
      ],
    },
  },
  ticketConversion: {
    title: 'Ticket Number Conversion',
    description: 'Handle non-numeric ticket values',
    details: {
      content: 'When ticket numbers contain letters or special characters, they need to be converted for the spinner.',
      tips: [
        'Original values are preserved for display',
        'Conversion ensures fair random selection',
        'Review conversions before proceeding',
      ],
    },
  },
  spinnerType: {
    title: 'Spinner Type',
    description: 'Choose the visual style for your raffle spinner',
    details: {
      content: 'Different spinner types provide unique visual experiences for your audience. Slot Machine offers a classic casino feel, Wheel provides a traditional spinning wheel, and Cards shows a shuffling card effect.',
      tips: [
        'Slot Machine works best for large audiences',
        'Wheel is great for smaller, intimate raffles',
        'Cards provides a sophisticated shuffling animation',
      ],
    },
  },
  textSizes: {
    title: 'Text Sizes',
    description: 'Control the size of participant names and ticket numbers',
    details: {
      content: 'Adjust text sizes to ensure visibility for your audience. Larger sizes work better for projection or streaming.',
    },
  },
  colors: {
    title: 'Color Customization',
    description: 'Customize colors to match your brand or event theme',
    details: {
      content: 'Click any color button to open a color picker. You can enter hex codes directly or use the visual picker.',
      examples: ['#FF0000 - Red', '#00FF00 - Green', '#0000FF - Blue'],
    },
  },
  logo: {
    title: 'Company Logo',
    description: 'Upload your company logo to display in the side panel',
    details: {
      content: 'Your logo will be displayed at the top of the side panel during raffles. For best results, use a transparent PNG file.',
      tips: [
        'Recommended size: 200x100 pixels',
        'Use PNG format for transparency',
        'Keep file size under 5MB',
      ],
    },
  },
  banner: {
    title: 'Default Banner',
    description: 'Upload a banner image to display across the top of the side panel',
    details: {
      content: 'The banner will be displayed prominently at the top of the raffle interface. This can be overridden by competition-specific banners.',
      tips: [
        'Recommended size: 800x200 pixels',
        'Use high-quality images for best display',
        'Consider your brand colors and theme',
      ],
    },
  },
  companyName: {
    title: 'Company Name',
    description: 'Display your company name alongside the logo',
    details: {
      content: 'Your company name will appear next to your logo if enabled. This helps with brand recognition during live events.',
    },
  },
  sessionWinners: {
    overview: {
      title: 'Session Winners',
      description: 'View all winners selected during this session',
      details: {
        content: 'This list shows all winners selected during the current browser session. The list is cleared when you close the browser.',
        tips: [
          'Winners are listed in chronological order',
          'Each entry shows name, ticket, and timestamp',
          'Use this to track your drawing history',
        ],
      },
    },
  },
};