import { useState, useEffect } from 'react';
import { Character, CharacterStats } from '../lib/types';
import { ROLES, ARCHETYPES, SKILLS } from '../lib/gameData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Dice1, User, Sparkles, Scroll } from '@phosphor-icons/react';

interface CharacterFormProps {
  character?: Character | null;
  onSave: (character: Character) => void;
  onCancel: () => void;
  isAuthenticated: boolean;
  user?: any;
}

const INITIAL_STATS: CharacterStats = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
};

const POINT_BUY_TOTAL = 27;

export function CharacterForm({ character, onSave, onCancel, isAuthenticated, user }: CharacterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    level: 1,
    role: '',
    archetype: '',
    stats: INITIAL_STATS,
    skills: [] as string[],
  });

  const [pointsSpent, setPointsSpent] = useState(0);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name,
        level: character.level,
        role: character.role,
        archetype: character.archetype,
        stats: character.stats,
        skills: character.skills,
      });
    }
  }, [character]);

  useEffect(() => {
    const spent = Object.values(formData.stats).reduce((total, stat) => {
      if (stat <= 13) return total + (stat - 8);
      if (stat === 14) return total + 7;
      if (stat === 15) return total + 9;
      return total;
    }, 0);
    setPointsSpent(spent);
  }, [formData.stats]);

  const getStatCost = (currentValue: number, newValue: number): number => {
    if (newValue <= 13) return newValue - currentValue;
    if (newValue === 14 && currentValue <= 13) return (currentValue <= 13 ? 14 - currentValue : 0) + 1;
    if (newValue === 15 && currentValue <= 14) return (currentValue <= 13 ? 15 - currentValue : 0) + (currentValue === 14 ? 2 : 0);
    return 0;
  };

  const canAffordStatIncrease = (statKey: keyof CharacterStats): boolean => {
    const currentValue = formData.stats[statKey];
    if (currentValue >= 15) return false;
    
    const cost = getStatCost(currentValue, currentValue + 1);
    return pointsSpent + cost <= POINT_BUY_TOTAL;
  };

  const handleStatChange = (statKey: keyof CharacterStats, value: number[]) => {
    const newValue = value[0];
    const currentValue = formData.stats[statKey];
    
    if (newValue > currentValue && !canAffordStatIncrease(statKey)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statKey]: newValue,
      },
    }));
  };

  const selectedRole = ROLES.find(role => role.id === formData.role);
  const availableArchetypes = ARCHETYPES.filter(arch => arch.roleId === formData.role);
  const selectedArchetype = ARCHETYPES.find(arch => arch.id === formData.archetype);

  const getAvailableSkills = (tier: 1 | 2 | 3) => {
    return SKILLS.filter(skill => {
      if (skill.tier !== tier) return false;
      if (!skill.roles) return true;
      return skill.roles.includes(formData.role);
    });
  };

  const getMaxSkillsForTier = (tier: 1 | 2 | 3): number => {
    const level = formData.level;
    if (tier === 1) return Math.min(level, 3);
    if (tier === 2) return Math.max(0, Math.min(level - 2, 2));
    if (tier === 3) return Math.max(0, Math.min(level - 5, 1));
    return 0;
  };

  const getSelectedSkillsForTier = (tier: 1 | 2 | 3): string[] => {
    return formData.skills.filter(skillId => {
      const skill = SKILLS.find(s => s.id === skillId);
      return skill?.tier === tier;
    });
  };

  const canSelectSkill = (skillId: string, tier: 1 | 2 | 3): boolean => {
    const selectedForTier = getSelectedSkillsForTier(tier);
    const maxForTier = getMaxSkillsForTier(tier);
    return selectedForTier.length < maxForTier || formData.skills.includes(skillId);
  };

  const toggleSkill = (skillId: string) => {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill) return;

    if (formData.skills.includes(skillId)) {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(id => id !== skillId),
      }));
    } else if (canSelectSkill(skillId, skill.tier)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillId],
      }));
    }
  };

  const handleSave = () => {
    const newCharacter: Character = {
      id: character?.id || `char-${Date.now()}`,
      name: formData.name,
      level: formData.level,
      role: formData.role,
      archetype: formData.archetype,
      stats: formData.stats,
      skills: formData.skills,
      createdAt: character?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(newCharacter);
  };

  const canSave = formData.name.trim() && formData.role && formData.archetype && pointsSpent <= POINT_BUY_TOTAL && isAuthenticated;

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onCancel} className="shrink-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">
              {character ? 'Edit Character' : 'Create New Character'}
            </h1>
            <p className="text-muted-foreground">
              {character ? 'Modify your existing hero' : 'Design your next legendary adventurer'}
            </p>
          </div>
        </div>

        {/* Authentication Status */}
        {isAuthenticated && user && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <img 
                src={user.avatarUrl} 
                alt={`${user.login}'s avatar`}
                className="w-8 h-8 rounded-full border border-accent/30"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-accent-foreground">
                  Signed in as {user.login}
                </p>
                <p className="text-xs text-muted-foreground">
                  Characters will be saved to your account
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-accent" weight="fill" />
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">
                  Not signed in
                </p>
                <p className="text-xs text-muted-foreground">
                  Character will not be saved - please sign in first
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="basic">
                <User className="w-4 h-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="stats">
                <Dice1 className="w-4 h-4 mr-2" />
                Attributes
              </TabsTrigger>
              <TabsTrigger value="role">
                <Sparkles className="w-4 h-4 mr-2" />
                Role & Archetype
              </TabsTrigger>
              <TabsTrigger value="skills">
                <Scroll className="w-4 h-4 mr-2" />
                Skills
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card className="parchment-bg fantasy-border">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">Character Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Character Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter character name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select 
                        value={formData.level.toString()} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, level: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(level => (
                            <SelectItem key={level} value={level.toString()}>
                              Level {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="parchment-bg fantasy-border">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">Attribute Scores</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Points used: {pointsSpent} / {POINT_BUY_TOTAL}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(Object.keys(formData.stats) as Array<keyof CharacterStats>).map((statKey) => (
                      <div key={statKey} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium capitalize">{statKey}</Label>
                          <span className="text-lg font-bold text-primary">{formData.stats[statKey]}</span>
                        </div>
                        <Slider
                          value={[formData.stats[statKey]]}
                          onValueChange={(value) => handleStatChange(statKey, value)}
                          min={8}
                          max={15}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-center">
                          Modifier: {Math.floor((formData.stats[statKey] - 10) / 2) >= 0 ? '+' : ''}{Math.floor((formData.stats[statKey] - 10) / 2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="role">
              <div className="space-y-6">
                <Card className="parchment-bg fantasy-border">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl text-primary">Choose Your Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ROLES.map((role) => (
                        <div
                          key={role.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            formData.role === role.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, role: role.id, archetype: '' }))}
                        >
                          <h3 className="font-serif font-semibold text-lg mb-2">{role.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {role.primaryStats.map(stat => (
                              <Badge key={stat} variant="secondary" className="text-xs">
                                {stat.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {formData.role && (
                  <Card className="parchment-bg fantasy-border">
                    <CardHeader>
                      <CardTitle className="font-serif text-xl text-primary">Choose Your Archetype</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableArchetypes.map((archetype) => (
                          <div
                            key={archetype.id}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              formData.archetype === archetype.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, archetype: archetype.id }))}
                          >
                            <h3 className="font-serif font-semibold text-lg mb-2">{archetype.name}</h3>
                            <p className="text-sm text-muted-foreground">{archetype.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="skills">
              <Card className="parchment-bg fantasy-border">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">Select Skills</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choose skills based on your level and role. Higher tier skills require higher levels.
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {[1, 2, 3].map((tier) => {
                    const availableSkills = getAvailableSkills(tier as 1 | 2 | 3);
                    const selectedForTier = getSelectedSkillsForTier(tier as 1 | 2 | 3);
                    const maxForTier = getMaxSkillsForTier(tier as 1 | 2 | 3);
                    
                    return (
                      <div key={tier} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-lg font-semibold">
                            Tier {tier} Skills
                          </h3>
                          <Badge variant="outline">
                            {selectedForTier.length} / {maxForTier} selected
                          </Badge>
                        </div>
                        
                        {maxForTier === 0 ? (
                          <p className="text-sm text-muted-foreground italic">
                            Tier {tier} skills unlock at level {tier === 2 ? '3' : '6'}
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availableSkills.map((skill) => {
                              const isSelected = formData.skills.includes(skill.id);
                              const canSelect = canSelectSkill(skill.id, skill.tier);
                              
                              return (
                                <div
                                  key={skill.id}
                                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'border-primary bg-primary/10'
                                      : canSelect
                                      ? 'border-border hover:border-primary/50'
                                      : 'border-border/50 opacity-50 cursor-not-allowed'
                                  }`}
                                  onClick={() => canSelect && toggleSkill(skill.id)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium">{skill.name}</h4>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {skill.description}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <Badge variant="default" className="ml-2 text-xs">
                                        Selected
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!canSave} 
              className="glow-hover"
              title={!isAuthenticated ? "Please sign in to save characters" : undefined}
            >
              <Sparkles className="w-4 h-4 mr-2" weight="fill" />
              {character ? 'Update Character' : 'Create Character'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}