import { Character } from '../lib/types';
import { ROLES, ARCHETYPES } from '../lib/gameData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Edit, FileText, Trash, Shield, Eye, Sparkles } from '@phosphor-icons/react';

interface CharacterListProps {
  characters: Character[];
  onEdit: (character: Character) => void;
  onDelete: (characterId: string) => void;
  onViewSheet: (character: Character) => void;
}

export function CharacterList({ characters, onEdit, onDelete, onViewSheet }: CharacterListProps) {
  const getRoleInfo = (roleId: string) => {
    return ROLES.find(role => role.id === roleId);
  };

  const getArchetypeInfo = (archetypeId: string) => {
    return ARCHETYPES.find(archetype => archetype.id === archetypeId);
  };

  const getStatModifier = (stat: number): string => {
    const modifier = Math.floor((stat - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character) => {
        const role = getRoleInfo(character.role);
        const archetype = getArchetypeInfo(character.archetype);
        
        return (
          <Card key={character.id} className="parchment-bg fantasy-border glow-hover group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="font-serif text-xl text-primary mb-1">
                    {character.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Level {character.level}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {role?.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {archetype?.name}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Stats Preview */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/50 rounded p-2">
                  <div className="text-xs text-muted-foreground">STR</div>
                  <div className="font-semibold">{character.stats.strength}</div>
                  <div className="text-xs text-accent">{getStatModifier(character.stats.strength)}</div>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <div className="text-xs text-muted-foreground">DEX</div>
                  <div className="font-semibold">{character.stats.dexterity}</div>
                  <div className="text-xs text-accent">{getStatModifier(character.stats.dexterity)}</div>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <div className="text-xs text-muted-foreground">INT</div>
                  <div className="font-semibold">{character.stats.intelligence}</div>
                  <div className="text-xs text-accent">{getStatModifier(character.stats.intelligence)}</div>
                </div>
              </div>

              {/* Skills Preview */}
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {character.skills.slice(0, 3).map((skillId) => (
                    <Badge key={skillId} variant="outline" className="text-xs">
                      {skillId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                  {character.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{character.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewSheet(character)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(character)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Character</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{character.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(character.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}