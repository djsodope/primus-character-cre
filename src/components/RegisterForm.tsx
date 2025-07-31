import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { UserPlus, Eye, EyeSlash, Check } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface RegisterFormProps {
  onShowLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onShowLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  // Password validation
  const passwordRequirements = {
    length: password.length >= 6,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password does not meet requirements');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      await register(email, password);
      toast.success('Account created successfully! Welcome, adventurer!');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto parchment-bg fantasy-border">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-accent" weight="fill" />
        </div>
        <CardTitle className="font-serif text-2xl text-primary">
          Join the Adventure
        </CardTitle>
        <p className="text-muted-foreground">
          Create your account to start building characters
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="fantasy-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                className="fantasy-border pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlash className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Password Requirements */}
            {password && (
              <div className="space-y-1 text-xs">
                <div className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-secondary' : 'text-muted-foreground'}`}>
                  <Check className={`w-3 h-3 ${passwordRequirements.length ? 'opacity-100' : 'opacity-30'}`} />
                  At least 6 characters
                </div>
                <div className={`flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-secondary' : 'text-muted-foreground'}`}>
                  <Check className={`w-3 h-3 ${passwordRequirements.lowercase ? 'opacity-100' : 'opacity-30'}`} />
                  Lowercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-secondary' : 'text-muted-foreground'}`}>
                  <Check className={`w-3 h-3 ${passwordRequirements.uppercase ? 'opacity-100' : 'opacity-30'}`} />
                  Uppercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordRequirements.number ? 'text-secondary' : 'text-muted-foreground'}`}>
                  <Check className={`w-3 h-3 ${passwordRequirements.number ? 'opacity-100' : 'opacity-30'}`} />
                  Number
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="fantasy-border pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlash className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full glow-hover" 
            disabled={loading || !isPasswordValid || password !== confirmPassword}
            size="lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <Separator className="my-6" />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Already have an account?
          </p>
          <Button 
            variant="outline" 
            onClick={onShowLogin}
            className="w-full fantasy-border"
          >
            Sign In Instead
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};