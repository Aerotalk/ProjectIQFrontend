import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useAvatarUrl(profilePhotoId: string | null | undefined) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    
    const loadAvatar = async () => {
      if (profilePhotoId) {
        try {
          const response = await api.get(`/admin/files/${profilePhotoId}`, {
            responseType: 'blob'
          });
          objectUrl = URL.createObjectURL(response as unknown as Blob);
          setAvatarUrl(objectUrl);
        } catch (error) {
          console.error("Failed to load avatar", error);
          setAvatarUrl(null);
        }
      } else {
        setAvatarUrl(null);
      }
    };
    
    loadAvatar();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [profilePhotoId]);

  return avatarUrl;
}
