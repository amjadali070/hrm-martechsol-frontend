import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

interface SocialMediaLink {
  platform: string;
  url: string;
  icon: React.ReactElement;
}

const socialMediaLinks: SocialMediaLink[] = [
  { platform: 'Facebook', url: 'https://facebook.com', icon: <FaFacebookF /> },
  { platform: 'Twitter', url: 'https://twitter.com', icon: <FaTwitter /> },
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: <FaLinkedinIn /> },
  { platform: 'YouTube', url: 'https://youtube.com', icon: <FaYoutube /> },
];

const Footer: React.FC = () => {
  return (
    <div className="bg-black py-4 flex justify-center items-center space-x-6 text-white w-[full]">
      <span className="text-sm">Follow Us</span>
      {socialMediaLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.platform}
          className="text-white hover:text-gray-200 transition-colors"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default Footer;