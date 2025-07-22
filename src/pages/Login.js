import React, { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (data.success) {
      alert('登录成功！');
      // 你可以把 token 和用户信息保存到 localStorage 或 context
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      alert('登录失败：' + data.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>登录</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="邮箱" onChange={handleChange} required /><br/>
        <input name="password" type="password" placeholder="密码" onChange={handleChange} required /><br/><br/>
        <button type="submit">登录</button>
      </form>
    </div>
  );
}

export default Login;
