import React from 'react';
import './Options.css';
import '../../assets/styles/tailwind.css';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  return <div className="OptionsContainer">{title} Page</div>;
};

export default Options;
