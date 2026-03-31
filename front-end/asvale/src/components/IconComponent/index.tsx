import React from 'react';
import { IconType, IconBaseProps } from 'react-icons';

interface IconComponentProps extends IconBaseProps {
  icon: IconType;
}

const IconComponent: React.FC<IconComponentProps> = ({ icon: Icon, ...props }) => {
  return <Icon {...props} />;
};

export default IconComponent; 