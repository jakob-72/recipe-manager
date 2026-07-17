import * as React from 'react';
import { Header } from './Header.tsx';
import { CenteredContent } from './CenteredContent.tsx';

interface PageProps {
  content: React.ReactNode;
}

export const Page = ({ content }: PageProps) => (
  <>
    <Header />
    <CenteredContent>{content}</CenteredContent>
  </>
);
