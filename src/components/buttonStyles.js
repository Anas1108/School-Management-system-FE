import styled from 'styled-components';
import { Button, IconButton } from '@mui/material';

const baseButtonStyles = `
  && {
    border-radius: var(--border-radius-md);
    padding: 6px 16px;
    font-weight: 600;
    font-family: var(--font-family-sans);
    text-transform: none;
    font-size: 0.85rem;
    letter-spacing: 0.01em;
    box-shadow: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0);
    }
  }
`;

export const RedButton = styled(Button)`
  ${baseButtonStyles}
  && {
    background-color: var(--color-error);
    color: white;
    &:hover {
      background-color: #dc2626;
    }
  }
`;

export const BlackButton = styled(Button)`
  ${baseButtonStyles}
  && {
    background-color: var(--color-gray-800);
    color: white;
    &:hover {
      background-color: var(--color-gray-700);
    }
  }
`;

export const DarkRedButton = styled(Button)`
  ${baseButtonStyles}
  && {
    background-color: #b91c1c;
    color: white;
    &:hover {
      background-color: #991b1b;
    }
  }
`;

export const BlueButton = styled(Button)`
  ${baseButtonStyles}
  && {
    background-color: var(--color-primary-600);
    color: #fff;
    &:hover {
      background-color: var(--color-primary-700);
    }
  }
`;

export const PurpleButton = styled(Button)`
  ${baseButtonStyles}
  && {
    background-color: var(--color-primary-700);
    color: #fff;
    &:hover {
      background-color: var(--color-primary-800);
    }
  }
`;

export const LightPurpleButton = styled(Button)`
  ${baseButtonStyles}
  && {
    background-color: var(--color-primary-500);
    color: #fff;
    &:hover {
      background-color: var(--color-primary-600);
    }
  }
`;

export const GreenButton = styled(Button)`
  ${baseButtonStyles}
  && {
    background-color: var(--color-success);
    color: #fff;
    &:hover {
      background-color: #059669;
    }
  }
`;

export const BrownButton = styled(Button)`
  ${baseButtonStyles}
  && {
    background-color: #92400e;
    color: white;
    &:hover {
      background-color: #78350f;
    }
  }
`;

export const IndigoButton = styled(Button)`
  ${baseButtonStyles}
  && {
    background-color: var(--color-info);
    color: white;
    &:hover {
      background-color: #2563eb;
    }
  }
`;

// ==========================================
// Compact Action Icon Buttons for Tables
// ==========================================

const baseIconBtnStyles = `
  && {
    width: 34px;
    height: 34px;
    border-radius: var(--border-radius-md);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    .MuiSvgIcon-root {
      font-size: 1.15rem;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    }
    &:active {
      transform: translateY(0);
    }

    /* Mobile Adjustment */
    @media (max-width: 600px) {
      width: 30px;
      height: 30px;
      
      .MuiSvgIcon-root {
        font-size: 1rem;
      }
    }
  }
`;

export const ActionIconButtonPrimary = styled(IconButton)`
  ${baseIconBtnStyles}
  && {
    background-color: var(--color-primary-50);
    color: var(--color-primary-700);
    &:hover {
      background-color: var(--color-primary-100);
    }
  }
`;

export const ActionIconButtonSuccess = styled(IconButton)`
  ${baseIconBtnStyles}
  && {
    background-color: #ecfdf5;
    color: var(--color-success);
    &:hover {
      background-color: #d1fae5;
    }
  }
`;

export const ActionIconButtonError = styled(IconButton)`
  ${baseIconBtnStyles}
  && {
    background-color: #fef2f2;
    color: var(--color-error);
    &:hover {
      background-color: #fee2e2;
    }
  }
`;

export const ActionIconButtonInfo = styled(IconButton)`
  ${baseIconBtnStyles}
  && {
    background-color: #eff6ff;
    color: var(--color-info);
    &:hover {
      background-color: #dbeafe;
    }
  }
`;

export const ActionIconButtonWarning = styled(IconButton)`
  ${baseIconBtnStyles}
  && {
    background-color: #fffbeb;
    color: var(--color-warning);
    &:hover {
      background-color: #fef3c7;
    }
  }
`;
