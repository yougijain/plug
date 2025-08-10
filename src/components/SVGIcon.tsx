import React from 'react';

interface SVGIconProps {
  name: string;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export const SVGIcon: React.FC<SVGIconProps> = ({ 
  name, 
  className = '', 
  width, 
  height, 
  alt 
}) => {
  const getIconPath = (iconName: string) => {
    // Map icon names to their file paths
    const iconMap: Record<string, string> = {
      'logo': '/assets/images/logo.png',
      'notification-badge': '/assets/icons/notification-badge.svg',
      'loading-spinner': '/assets/icons/loading-spinner.svg',
      'empty-state': '/assets/illustrations/home_no_posts.svg',
      'no-messages': '/assets/illustrations/messages_empty.svg',
      'success': '/assets/illustrations/success.svg',
      'notifications-empty': '/assets/illustrations/notifications_empty.svg',
      'search-empty': '/assets/illustrations/search_empty.svg',
      'buying-empty': '/assets/illustrations/buying_empty.svg',
      'selling-empty': '/assets/illustrations/selling_empty.svg',
      'saved-empty': '/assets/illustrations/saved_empty.svg',
      'live-empty': '/assets/illustrations/live_empty.svg',
    };
    
    return iconMap[iconName] || `/assets/icons/${iconName}.svg`;
  };

  return (
    <img
      src={getIconPath(name)}
      alt={alt || `${name} icon`}
      className={className}
      width={width}
      height={height}
    />
  );
};

// Convenience components for specific icons
export const LogoIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="logo" {...props} />
);

export const EmptyStateIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="empty-state" {...props} />
);

export const NoMessagesIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="no-messages" {...props} />
);

export const SuccessIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="success" {...props} />
);

export const LoadingSpinner: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="loading-spinner" {...props} />
);

// Additional empty state illustrations
export const NotificationsEmptyIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="notifications-empty" {...props} />
);

export const SearchEmptyIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="search-empty" {...props} />
);

export const BuyingEmptyIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="buying-empty" {...props} />
);

export const SellingEmptyIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="selling-empty" {...props} />
);

export const SavedEmptyIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="saved-empty" {...props} />
);

export const LiveEmptyIcon: React.FC<{ className?: string; width?: number; height?: number }> = (props) => (
  <SVGIcon name="live-empty" {...props} />
);
