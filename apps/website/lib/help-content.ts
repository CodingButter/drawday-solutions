export const helpContent = {
  competitionSelector: {
    title: 'Competition Selection',
    description: 'Choose the competition to run the raffle for',
    details: {
      content: 'Select from your imported competitions. Each competition contains its own set of participants and winners.',
    },
  },
  spinnerSettings: {
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
};