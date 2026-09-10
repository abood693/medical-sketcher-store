export type CourseLevel = "A1/A2" | "B1/B2" | "C1/C2";

export type LearningQuestion = {
  id: number;
  level: CourseLevel;
  prompt: string;
  choices: string[];
  correctIndex: number;
};

export const starterQuestions: Record<CourseLevel, LearningQuestion[]> = {
  "A1/A2": [
    { id: -1101, level: "A1/A2", prompt: "Lesson 1 — Sich vorstellen: Wie ___ du?", choices: ["heißt", "heißen", "heiße"], correctIndex: 0 },
    { id: -1102, level: "A1/A2", prompt: "Lesson 1 — Sich vorstellen: Ich ___ Abdelrazaq.", choices: ["heißt", "heiße", "heißen"], correctIndex: 1 },
    { id: -1103, level: "A1/A2", prompt: "Lesson 1 — Sich vorstellen: Woher kommst du?", choices: ["Ich wohne in Jordanien.", "Ich komme aus Jordanien.", "Ich bin Jordanien."], correctIndex: 1 },
    { id: -1104, level: "A1/A2", prompt: "Lesson 2 — Beruf & Persönliches: Ich ___ Krankenpfleger.", choices: ["bist", "bin", "sind"], correctIndex: 1 },
    { id: -1105, level: "A1/A2", prompt: "Lesson 2 — Beruf & Persönliches: Wir ___ im Krankenhaus.", choices: ["ist", "seid", "sind"], correctIndex: 2 },
    { id: -1106, level: "A1/A2", prompt: "Lesson 2 — Beruf & Persönliches: Der Patient ___ Schmerzen.", choices: ["habe", "hat", "haben"], correctIndex: 1 },
    { id: -1107, level: "A1/A2", prompt: "Lesson 3 — Familie & Sprachen: Das ist ___ Bruder.", choices: ["mein", "meine", "meinen"], correctIndex: 0 },
    { id: -1108, level: "A1/A2", prompt: "Lesson 3 — Familie & Sprachen: Ich ___ Deutsch.", choices: ["spreche", "spricht", "sprechen"], correctIndex: 0 },
    { id: -1109, level: "A1/A2", prompt: "Lesson 3 — Familie & Sprachen: Du ___ Englisch.", choices: ["spreche", "spricht", "sprichst"], correctIndex: 2 },
    { id: -1110, level: "A1/A2", prompt: "Lesson 4 — Möbel & Preise: ___ Tisch ist groß.", choices: ["Die", "Das", "Der"], correctIndex: 2 },
    { id: -1111, level: "A1/A2", prompt: "Lesson 4 — Möbel & Preise: Das Bett ist neu. → ___ ist neu.", choices: ["Er", "Es", "Sie"], correctIndex: 1 },
    { id: -1112, level: "A1/A2", prompt: "Lesson 4 — Möbel & Preise: Wie viel kostet die Lampe?", choices: ["Sie kostet 50 Euro.", "Er kostet 50 Euro.", "Es kostet 50 Euro."], correctIndex: 0 },
    { id: -1113, level: "A1/A2", prompt: "Lesson 5 — Ein / Kein: Das ist ___ Buch.", choices: ["ein", "eine", "einen"], correctIndex: 0 },
    { id: -1114, level: "A1/A2", prompt: "Lesson 5 — Ein / Kein: Das ist ___ Tasche.", choices: ["ein", "eine", "einen"], correctIndex: 1 },
    { id: -1115, level: "A1/A2", prompt: "Lesson 5 — Ein / Kein: Ich habe ___ Handy.", choices: ["kein", "keine", "nicht"], correctIndex: 0 },
    { id: -1116, level: "A1/A2", prompt: "Lesson 6 — Telefon & Akkusativ: Ich habe ___ Termin.", choices: ["ein", "einen", "eine"], correctIndex: 1 },
    { id: -1117, level: "A1/A2", prompt: "Lesson 6 — Telefon & Akkusativ: Ich brauche ___ Stift.", choices: ["ein", "eine", "einen"], correctIndex: 2 },
    { id: -1118, level: "A1/A2", prompt: "Lesson 6 — Telefon & Akkusativ: Was ist richtig?", choices: ["Ich habe eine Patient.", "Ich habe einen Patient.", "Ich habe einen Patienten."], correctIndex: 2 },
    { id: -1119, level: "A1/A2", prompt: "Lesson 7 — Hobbys & können: Ich ___ Fußball spielen.", choices: ["kann", "kannst", "können"], correctIndex: 0 },
    { id: -1120, level: "A1/A2", prompt: "Lesson 7 — Hobbys & können: Du ___ Deutsch sprechen.", choices: ["kann", "kannst", "können"], correctIndex: 1 },
    { id: -1121, level: "A1/A2", prompt: "Lesson 7 — Hobbys & können: Was ist richtig?", choices: ["Ich kann Deutsch sprechen.", "Ich kann spreche Deutsch.", "Ich kann Deutsch spricht."], correctIndex: 0 },
    { id: -1122, level: "A1/A2", prompt: "Lesson 8 — Termine & Uhrzeit: Der Termin ist ___ Montag.", choices: ["um", "am", "im"], correctIndex: 1 },
    { id: -1123, level: "A1/A2", prompt: "Lesson 8 — Termine & Uhrzeit: Der Termin ist ___ 10 Uhr.", choices: ["am", "im", "um"], correctIndex: 2 },
    { id: -1124, level: "A1/A2", prompt: "Lesson 8 — Termine & Uhrzeit: Was ist richtig?", choices: ["Wir treffen uns am 8 Uhr.", "Wir treffen uns um 8 Uhr.", "Wir treffen uns im 8 Uhr."], correctIndex: 1 },
    { id: -1125, level: "A1/A2", prompt: "Lesson 9 — Trennbare Verben: Ich ___ um 7 Uhr ___.", choices: ["stehe / auf", "aufstehe / —", "stehen / auf"], correctIndex: 0 },
    { id: -1126, level: "A1/A2", prompt: "Lesson 9 — Trennbare Verben: Wann ___ du ___?", choices: ["fängst / an", "anfängst / —", "anfangen / —"], correctIndex: 0 },
    { id: -1127, level: "A1/A2", prompt: "Lesson 10 — Perfekt mit haben: Ich ___ Deutsch gelernt.", choices: ["bin", "habe", "hat"], correctIndex: 1 },
    { id: -1128, level: "A1/A2", prompt: "Lesson 10 — Perfekt mit haben: Wir ___ Fußball gespielt.", choices: ["haben", "sind", "seid"], correctIndex: 0 },
    { id: -1129, level: "A1/A2", prompt: "Lesson 11 — Perfekt mit sein: Ich ___ nach Berlin gefahren.", choices: ["habe", "bin", "hat"], correctIndex: 1 },
    { id: -1130, level: "A1/A2", prompt: "Lesson 11 — Perfekt mit sein: Sie ___ nach Hause gegangen.", choices: ["hat", "haben", "ist"], correctIndex: 2 },
  ],
  "B1/B2": [
    { id: -201, level: "B1/B2", prompt: "Welche Formulierung ist bei einem Patienten besonders höflich?", choices: ["Mach das jetzt.", "Könnten Sie bitte Platz nehmen?", "Du gehst dahin.", "Gib das."], correctIndex: 1 },
    { id: -202, level: "B1/B2", prompt: "Was bedeutet 'Beschwerden'?", choices: ["Patient symptoms", "Medical bills", "Nursing shifts", "Appointments"], correctIndex: 0 },
    { id: -203, level: "B1/B2", prompt: "Welcher Satz beschreibt eine Beobachtung?", choices: ["Der Patient klagt über Schmerzen.", "Schmerztablette sofort!", "Wo wohnen Sie?", "Guten Morgen."], correctIndex: 0 },
  ],
  "C1/C2": [
    { id: -301, level: "C1/C2", prompt: "Welche Aussage dokumentiert eine klinische Beobachtung präzise?", choices: ["Es geht ihm schlecht.", "Der Patient wirkte irgendwie müde.", "Der Patient zeigte eine zunehmende Dyspnoe bei Belastung.", "Alles war normal."], correctIndex: 2 },
    { id: -302, level: "C1/C2", prompt: "Was ist für ein professionelles Übergabegespräch zentral?", choices: ["Vermutungen ohne Kontext", "Strukturierte, relevante Beobachtungen", "Private Details", "Unklare Abkürzungen"], correctIndex: 1 },
    { id: -303, level: "C1/C2", prompt: "Welche Formulierung zeigt Empathie und Fachlichkeit?", choices: ["Das ist nicht mein Problem.", "Ich nehme Ihre Sorge ernst und kläre das sofort ab.", "Warten Sie einfach.", "Das passiert eben."], correctIndex: 1 },
  ],
};

export function scoreAnswers(questions: LearningQuestion[], answers: number[]) {
  return questions.reduce((score, question, index) => score + (answers[index] === question.correctIndex ? 1 : 0), 0);
}
