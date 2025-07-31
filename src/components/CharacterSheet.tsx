import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Character, STAT_NAMES, STAT_ABBREVIATIONS } from '../lib/types';
import { ROLES, ARCHETYPES, SKILLS } from '../lib/gameData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Download, Edit, Printer } from '@phosphor-icons/react';

interface CharacterSheetProps {
  character: Character;
  onBack: () => void;
  onEdit: () => void;
}

export function CharacterSheet({ character, onBack, onEdit }: CharacterSheetProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const role = ROLES.find(r => r.id === character.role);
  const archetype = ARCHETYPES.find(a => a.id === character.archetype);

  const getStatModifier = (stat: number): string => {
    const modifier = Math.floor((stat - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const getCharacterSkills = () => {
    return character.skills.map(skillId => 
      SKILLS.find(skill => skill.id === skillId)
    ).filter(Boolean);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${character.name} - Character Sheet`,
  });

  const handleExportPDF = () => {
    handlePrint();
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Non-printable header */}
      <div className="print:hidden">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack} className="shrink-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Characters
              </Button>
              <div>
                <h1 className="font-serif text-3xl font-bold text-primary">
                  {character.name}
                </h1>
                <p className="text-muted-foreground">
                  Level {character.level} {archetype?.name} {role?.name}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Character
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleExportPDF} className="glow-hover">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable character sheet */}
      <div ref={printRef} className="print:p-0 print:m-0">
        <div className="container mx-auto px-4 pb-8 print:px-0 print:pb-0">
          <div className="max-w-4xl mx-auto print:max-w-none">
            
            {/* Character Header */}
            <Card className="parchment-bg fantasy-border mb-6 print:shadow-none print:mb-4">
              <CardHeader className="text-center print:pb-4">
                <CardTitle className="font-serif text-4xl font-bold text-primary print:text-3xl">
                  {character.name}
                </CardTitle>
                <div className="flex items-center justify-center gap-6 text-lg print:text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-semibold">{character.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-semibold">{role?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Archetype:</span>
                    <span className="font-semibold">{archetype?.name}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:gap-4">
              
              {/* Ability Scores */}
              <div className="lg:col-span-1">
                <Card className="parchment-bg fantasy-border print:shadow-none">
                  <CardHeader className="print:pb-2">
                    <CardTitle className="font-serif text-xl text-primary">Ability Scores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 print:space-y-2">
                    {(Object.keys(character.stats) as Array<keyof typeof character.stats>).map((statKey) => {
                      const statValue = character.stats[statKey];
                      const modifier = getStatModifier(statValue);
                      
                      return (
                        <div key={statKey} className="stat-block p-3 print:p-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-serif font-semibold text-lg print:text-base">
                                {STAT_NAMES[statKey]}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {STAT_ABBREVIATIONS[statKey]}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary print:text-xl">
                                {statValue}
                              </div>
                              <div className="text-lg text-accent print:text-base">
                                {modifier}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Character Details & Skills */}
              <div className="lg:col-span-2 space-y-6 print:space-y-4">
                
                {/* Role & Archetype Details */}
                <Card className="parchment-bg fantasy-border print:shadow-none">
                  <CardHeader className="print:pb-2">
                    <CardTitle className="font-serif text-xl text-primary">Character Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 print:space-y-2">
                    <div>
                      <h3 className="font-serif font-semibold text-lg mb-2 print:text-base print:mb-1">
                        {role?.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {role?.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-sm text-muted-foreground">Primary Stats:</span>
                        {role?.primaryStats.map(stat => (
                          <Badge key={stat} variant="secondary" className="text-xs">
                            {STAT_ABBREVIATIONS[stat]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-serif font-semibold text-lg mb-2 print:text-base print:mb-1">
                        {archetype?.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {archetype?.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card className="parchment-bg fantasy-border print:shadow-none">
                  <CardHeader className="print:pb-2">
                    <CardTitle className="font-serif text-xl text-primary">Skills & Abilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6 print:space-y-4">
                      {[1, 2, 3].map(tier => {
                        const tierSkills = getCharacterSkills().filter(skill => skill?.tier === tier);
                        
                        if (tierSkills.length === 0) return null;
                        
                        return (
                          <div key={tier}>
                            <h3 className="font-serif font-semibold text-lg mb-3 print:text-base print:mb-2 flex items-center gap-2">
                              Tier {tier} Skills
                              <Badge variant="outline" className="text-xs">
                                {tierSkills.length} skill{tierSkills.length !== 1 ? 's' : ''}
                              </Badge>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:gap-2">
                              {tierSkills.map(skill => (
                                <div key={skill?.id} className="stat-block p-3 print:p-2">
                                  <h4 className="font-semibold mb-1">{skill?.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {skill?.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Character Notes Section (for printing) */}
            <div className="mt-6 print:mt-4 print:break-inside-avoid">
              <Card className="parchment-bg fantasy-border print:shadow-none">
                <CardHeader className="print:pb-2">
                  <CardTitle className="font-serif text-xl text-primary">Character Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 print:space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                      <div>
                        <h4 className="font-semibold mb-2">Background & Personality</h4>
                        <div className="h-20 border border-border rounded p-2 print:h-16"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Goals & Motivations</h4>
                        <div className="h-20 border border-border rounded p-2 print:h-16"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Equipment & Inventory</h4>
                      <div className="h-24 border border-border rounded p-2 print:h-20"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Additional Notes</h4>
                      <div className="h-32 border border-border rounded p-2 print:h-24"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 text-center text-sm text-muted-foreground">
              <p>Character created with Primus Character Creator</p>
              <p>Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.5in;
            size: letter;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .fantasy-border {
            border: 2px solid #8B4513 !important;
            box-shadow: none !important;
          }
          
          .parchment-bg {
            background: #FDF6E3 !important;
          }
          
          .stat-block {
            border: 1px solid #8B4513 !important;
            background: #FAF0E6 !important;
          }
        }
      `}</style>
    </div>
  );
}