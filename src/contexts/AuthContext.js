import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 页面刷新时尝试从 localStorage 恢复 user 状态
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 登录时保存用户信息（user 里可包含任意字段，比如后端传来的 pendingNotification）
  const login = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // 登出时清除用户状态
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 新增：刷新当前用户信息，重新请求后端接口
  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`https://myclean-backend.onrender.com/api/users/${user.id}`);

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Failed to refresh user info:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
