import {Form} from "react-bootstrap";
import React, {useState} from "react";

export const ThemeSwitch = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setTheme(event.currentTarget.checked ? 'dark' : 'light');
  };

  return (
    <Form.Check
      inline={true}
      type="switch"
      label="Dark Mode"
      className={theme === 'dark' ? 'text-white' : 'text-dark'}
      checked={theme === 'dark'} onChange={handleChange}
    />
  )
}
