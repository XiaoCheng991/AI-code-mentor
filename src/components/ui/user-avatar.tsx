"use client"

import { useState } from "react"

interface UserAvatarProps {
  avatarUrl?: string | null
  displayName?: string | null
  email?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

export function UserAvatar({ 
  avatarUrl, 
  displayName, 
  email,
  size = "md",
  className = "" 
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-xl"
  }
  
  const sizeClass = sizeClasses[size]
  const fallbackLetter = displayName?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || "U"
  
  return (
    <>
      {avatarUrl && !imageError ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className={`${sizeClass} rounded-full object-cover ${className}`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`${sizeClass} rounded-full bg-primary/10 flex items-center justify-center ${className}`}>
          <span className="text-primary font-medium">
            {fallbackLetter}
          </span>
        </div>
      )}
    </>
  )
}
