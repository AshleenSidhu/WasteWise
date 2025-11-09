import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  animated?: boolean;
}

export default function Logo({ 
  size = 'medium', 
  showText = true, 
  animated = false 
}: LogoProps) {
  const sizes = {
    small: 32,
    medium: 40,
    large: 150,
  };

  const imageSize = sizes[size];

  return (
    <Link 
      href="/" 
      className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${
        animated ? 'animate-bounce-slow' : ''
      }`}
    >
      <Image
        src="/1.svg"
        alt="WasteWise Logo"
        width={imageSize}
        height={imageSize}
        className={`w-${imageSize/4} h-${imageSize/4} drop-shadow-lg`}
      />
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent ${
          size === 'large' ? 'text-4xl' : size === 'medium' ? 'text-2xl' : 'text-xl'
        }`}>
          WasteWise
        </span>
      )}
    </Link>
  );
}
