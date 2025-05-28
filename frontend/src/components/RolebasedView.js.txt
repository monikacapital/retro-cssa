import React from 'react';

/**
 * RoleBasedView - komponent do zarządzania widokiem na podstawie roli użytkownika
 * @param {Object} props
 * @param {string} props.role - rola użytkownika ('developer', 'tester', 'pm')
 * @param {React.ReactNode} props.children - zawartość dla podstawowego widoku
 * @param {React.ReactNode} props.pmView - zawartość dla widoku Project Managera
 */
const RoleBasedView = ({ role, children, pmView }) => {
  // Role podstawowe (ograniczone uprawnienia)
  const basicRoles = ['developer', 'tester'];

  // Jeśli użytkownik ma rolę podstawową, pokaż podstawowy widok
  if (basicRoles.includes(role)) {
    return <>{children}</>;
  }

  // Jeśli użytkownik ma rolę PM, pokaż rozszerzony widok
  if (role === 'pm') {
    return <>{pmView}</>;
  }

  // Domyślnie pokazuj podstawowy widok
  return <>{children}</>;
};

export default RoleBasedView;
