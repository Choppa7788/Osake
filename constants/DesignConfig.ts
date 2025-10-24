// Design Configuration for Index and Library Pages
// Modify these values to easily customize the appearance

export const IndexDesignConfig = {
  // Color Themes
  colors: {
    light: {
      background: '#EAFFD0',
      surface: '#D4F1A8',
      primary: '#58CC02',
      accent: '#FF9600',
      text: '#1a1a1a',
      textSecondary: '#3a5a0a',
      card: 'rgba(255, 255, 255, 0.95)',
      headerBg: 'rgba(255, 255, 255, 0.98)',
      border: '#C5E89A',
    },
    dark: {
      background: '#0F1419',
      surface: '#1C252E',
      primary: '#58CC02',
      accent: '#FF9600',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      card: 'rgba(28, 37, 46, 0.8)',
      headerBg: 'rgba(28, 37, 46, 0.95)',
      border: '#2C3E50',
    }
  },

  // Layout & Spacing
  layout: {
    headerPadding: 20,
    sectionSpacing: 32,
    cardSpacing: 12,
    horizontalMargin: 18,
    borderRadius: {
      small: 16,
      medium: 20,
      large: 24,
      header: 32,
    }
  },

  // Typography
  typography: {
    headerGreeting: {
      fontSize: 26,
      fontWeight: '800' as '800',
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 11,
      opacity: 0.7,
    },
    sectionLabel: {
      fontSize: 22,
      fontWeight: '700' as '700',
      letterSpacing: -0.2,
    },
    cardTitle: {
      fontSize: 12,
      fontWeight: '600' as '600',
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: '800' as '800',
    },
    featureSubtitle: {
      fontSize: 13,
      fontWeight: '500' as '500',
    }
  },

  // Card Dimensions
  cards: {
    standard: {
      width: 180,
      height: 180,
    },
    spirit: {
      width: 180,
      height: 220,
    },
    special: {
      widthPercent: '48%',
      height: 160,
    }
  },

  // Effects & Shadows
  effects: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    borderWidth: 1.5,
    borderOpacity: 0.3,
  },

  // Header Icon
  headerIcon: {
    size: 52,
    borderRadius: 26,
    iconSize: 28,
  },

  // Search Button
  searchButton: {
    borderRadius: 20,
    padding: 12,
    iconSize: 20,
  }
};

export const LibraryDesignConfig = {
  // Color Themes
  colors: {
    light: {
      background: '#FFFFFF',
      headerBg: '#58CC02',
      card: '#F7F7F7',
      text: '#3C3C43',
      iconBg: 'rgba(88,204,2,0.08)',
      border: '#E5E5E7',
    },
    dark: {
      background: '#0F1419',
      headerBg: '#58CC02',
      card: '#1C252E',
      text: '#FFFFFF',
      iconBg: 'rgba(255,255,255,0.08)',
      border: '#2C3E50',
    }
  },

  // Layout & Spacing
  layout: {
    headerPaddingTop: 48,
    headerPaddingBottom: 18,
    headerHorizontal: 24,
    itemMargin: 18,
    itemSpacing: 14,
    scrollPaddingTop: 12,
    scrollPaddingBottom: 24,
    borderRadius: {
      header: 24,
      item: 16,
      icon: 14,
    }
  },

  // Typography
  typography: {
    header: {
      fontSize: 28,
      fontWeight: 'bold' as 'bold',
      letterSpacing: -0.5,
    },
    itemText: {
      fontSize: 19,
      fontWeight: '600' as '600',
    },
    premiumTitle: {
      fontSize: 22,
      fontWeight: 'bold' as 'bold',
    },
    premiumDescription: {
      fontSize: 16,
      lineHeight: 22,
    }
  },

  // Item Dimensions
  item: {
    padding: 18,
    iconContainer: {
      width: 54,
      height: 54,
      marginRight: 18,
    },
    iconSize: 32,
  },

  // Effects & Shadows
  effects: {
    headerShadow: {
      elevation: 4,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    itemShadow: {
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    }
  },

  // Premium Modal
  modal: {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
      margin: 20,
      padding: 24,
      borderRadius: 14,
      minWidth: 300,
    },
    buttons: {
      padding: { horizontal: 22, vertical: 12 },
      borderRadius: 6,
      upgradeColor: '#42db7a',
    }
  }
};

// Utility function to get current theme colors
export const getIndexColors = (isDarkMode: boolean) =>
  isDarkMode ? IndexDesignConfig.colors.dark : IndexDesignConfig.colors.light;

export const getLibraryColors = (isDarkMode: boolean) =>
  isDarkMode ? LibraryDesignConfig.colors.dark : LibraryDesignConfig.colors.light;