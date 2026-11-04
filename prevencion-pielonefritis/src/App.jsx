import React from 'react';
import SidebarBanner from './components/SidebarBanner';
import RegisterForm from './components/RegisterForm';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-neutral-100 flex flex-col lg:flex-row overflow-x-hidden m-0 p-0">
      <SidebarBanner />
      <RegisterForm />
    </div>
  );
}