import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Crown, User } from '@phosphor-icons/react';

interface UserProfileProps {
  user: {
    login: string;
    avatarUrl: string;
    email?: string;
    isOwner: boolean;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="max-w-md mx-auto bg-accent/5 border-accent/20">
      <CardContent className="flex items-center gap-3 py-4">
        <div className="relative">
          <img 
            src={user.avatarUrl} 
            alt={`${user.login}'s avatar`}
            className="w-12 h-12 rounded-full border-2 border-accent/30"
          />
          {user.isOwner && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-accent-foreground" weight="fill" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">
              {user.login}
            </h3>
            {user.isOwner && (
              <Badge variant="secondary" className="text-xs">
                Owner
              </Badge>
            )}
          </div>
          {user.email && (
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
          )}
        </div>
        
        <div className="text-accent">
          <User className="w-5 h-5" weight="fill" />
        </div>
      </CardContent>
    </Card>
  );
}