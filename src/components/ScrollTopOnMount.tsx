'use client';

import { useEffect } from 'react';

/**
 * 组件挂载时滚动到顶部
 * 用于确保页面刷新后总是从顶部开始
 */
export default function ScrollTopOnMount() {
  useEffect(() => {
    // 在组件挂载时滚动到顶部
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return null;
}