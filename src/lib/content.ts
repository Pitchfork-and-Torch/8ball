export type ModeId = "classic" | "permission" | "dare" | "idea" | "affirmation";

export const MODES: {
  id: ModeId;
  label: string;
  blurb: string;
}[] = [
  { id: "classic", label: "Classic", blurb: "Ask a yes/no question. Shake the ball. Accept fate." },
  { id: "permission", label: "Permission", blurb: "The ball grants clearance to stop overthinking." },
  { id: "dare", label: "Dare", blurb: "Tiny rebellious quests. No actual crimes." },
  { id: "idea", label: "Idea", blurb: "Delightfully questionable suggestions from the void." },
  { id: "affirmation", label: "Affirm", blurb: "Aggressive self-belief, served through the triangle." },
];

export const CLASSIC_ANSWERS = [
  { text: "It is certain", tone: "yes" as const },
  { text: "It is decidedly so", tone: "yes" as const },
  { text: "Without a doubt", tone: "yes" as const },
  { text: "Yes  -  definitely", tone: "yes" as const },
  { text: "You may rely on it", tone: "yes" as const },
  { text: "As I see it, yes", tone: "yes" as const },
  { text: "Most likely", tone: "yes" as const },
  { text: "Outlook good", tone: "yes" as const },
  { text: "Yes", tone: "yes" as const },
  { text: "Signs point to yes", tone: "yes" as const },
  { text: "Reply hazy, try again", tone: "maybe" as const },
  { text: "Ask again later", tone: "maybe" as const },
  { text: "Better not tell you now", tone: "maybe" as const },
  { text: "Cannot predict now", tone: "maybe" as const },
  { text: "Concentrate and ask again", tone: "maybe" as const },
  { text: "Don't count on it", tone: "no" as const },
  { text: "My reply is no", tone: "no" as const },
  { text: "My sources say no", tone: "no" as const },
  { text: "Outlook not so good", tone: "no" as const },
  { text: "Very doubtful", tone: "no" as const },
  // Extra spicy modern ones
  { text: "Absolutely chaotic yes", tone: "yes" as const },
  { text: "Hard pass from the cosmos", tone: "no" as const },
  { text: "The universe says go", tone: "yes" as const },
  { text: "Protect your peace  -  no", tone: "no" as const },
  { text: "Sleep on it (actually sleep)", tone: "maybe" as const },
  { text: "Double down", tone: "yes" as const },
  { text: "Walk away in slow motion", tone: "no" as const },
  { text: "This is your sign", tone: "yes" as const },
];

export const PERMISSIONS = [
  "You have permission to close that 47-tab browser spiral and go outside.",
  "You have permission to order the fancy thing. Life is short. Sauce is free.",
  "You have permission to leave the group chat on read for three business days.",
  "You have permission to wear the outfit that is 12% too much.",
  "You have permission to delete the draft email you rewrote nine times.",
  "You have permission to nap like a Victorian ghost with unfinished business.",
  "You have permission to say 'I don't know' without a follow-up TED talk.",
  "You have permission to start the project imperfectly at 40% quality.",
  "You have permission to mute that one person. You know who.",
  "You have permission to buy flowers for no reason other than vibes.",
  "You have permission to stop optimizing your morning routine.",
  "You have permission to be bad at something new for an entire season.",
  "You have permission to leave the party while you're still having fun.",
  "You have permission to use the good candles on a random Tuesday.",
  "You have permission to not have a take on every news cycle.",
  "You have permission to block, unfollow, and soft-launch a quieter life.",
  "You have permission to text first. Vulnerability is a power move.",
  "You have permission to keep the hobby that makes no money and all joy.",
  "You have permission to rearrange your room instead of solving capitalism.",
  "You have permission to celebrate a tiny win like you won a Grammy.",
];

export const DARES = [
  "Compliment a stranger's shoes with zero irony.",
  "Send a voice note instead of a paragraph essay.",
  "Cook something with a spice you've never touched.",
  "Dance in your kitchen for one full song. Curtains optional.",
  "Write a bad poem about your day and show nobody.",
  "Wear mismatched socks on purpose as a personality trait.",
  "Take a walk with no destination and no podcast.",
  "Tell a friend one specific thing you admire about them.",
  "Delete one app that only exists to make you feel behind.",
  "Make eye contact with yourself in the mirror and say 'nice.'",
  "Order the menu item you always almost get.",
  "Leave a sticky note of pure nonsense for Future You.",
  "Spend 10 minutes making something ugly on purpose.",
  "Text someone 'thinking of you' with no agenda attached.",
  "Change your phone wallpaper to something that makes you laugh.",
  "Do a 2-minute stretch like you're in a 90s workout VHS.",
  "Pick a color and wear only that energy tomorrow.",
  "Ask a question in a meeting you've been sitting on.",
  "Draw your mood as a monster. Name it. Free it.",
  "Go to bed 30 minutes earlier like a rebellious monk.",
];

export const BAD_IDEAS = [
  "Start a micro-cult around excellent sandwiches.",
  "Rename your Wi-Fi to something that starts arguments.",
  "Learn three magic tricks and refuse to explain any of them.",
  "Create a fake holiday and invite three people to celebrate it.",
  "Write fanfiction about your coworkers as fantasy characters (never share).",
  "Build a playlist called 'Songs for Leaving the Situation' and use it liberally.",
  "Collect interesting rocks like you're preparing for a museum heist.",
  "Speak exclusively in movie quotes for one meal.",
  "Invent a signature handshake and debut it unprompted.",
  "Start a rumor that you can see one second into the future.",
  "Make a vision board that is only snacks and chaos.",
  "Host a 'bring your weirdest talent' hangout.",
  "Learn the flute badly and document the journey.",
  "Design a flag for your apartment and raise it ceremonially.",
  "Rank every cereal like a film critic with awards season energy.",
  "Write a resignation letter from a job you don't have.",
  "Create a secret society with a two-person maximum: you and a plant.",
  "Practice dramatic entrances into empty rooms.",
  "Start a one-person book club that only reads the first chapter.",
  "Replace small talk with 'what's your current conspiracy theory?'",
];

export const AFFIRMATIONS = [
  "You are not behind. You are on a weird little side quest.",
  "Your taste is elite. The algorithm is simply confused.",
  "You survived every awkward moment so far. Undefeated.",
  "You are allowed to take up space, bandwidth, and the good seat.",
  "Your soft days still count. Recovery is a plot point.",
  "You are not too much. Some rooms are simply too small.",
  "Future You is already proud of the attempt you're about to make.",
  "You contain multitudes, snacks, and at least three good ideas.",
  "Your pace is valid. Even glaciers move mountains eventually.",
  "You are the main character of a story that is still getting good.",
  "Your boundaries are a love language. Keep speaking fluently.",
  "You don't need to earn rest. You already qualify.",
  "You are building a life, not performing one for an audience.",
  "Your weirdness is a feature. Ship it.",
  "You have survived 100% of your worst days. Statistical menace.",
  "You are allowed to change your mind without filing paperwork.",
  "Your presence is a gift. Even when you're quiet.",
  "You are not a productivity app. You are a person. Be messy.",
  "Confidence looks good on you. Try it on in this lighting.",
  "You are one bold decision away from a better anecdote.",
];

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function generateResult(mode: ModeId, question?: string): {
  headline: string;
  body: string;
  tone: "yes" | "no" | "maybe" | "neutral";
} {
  switch (mode) {
    case "permission":
      return { headline: "PERMISSION GRANTED", body: pick(PERMISSIONS), tone: "yes" };
    case "dare":
      return { headline: "YOUR DARE", body: pick(DARES), tone: "neutral" };
    case "idea":
      return { headline: "FROM THE VOID", body: pick(BAD_IDEAS), tone: "maybe" };
    case "affirmation":
      return { headline: "READ THIS TWICE", body: pick(AFFIRMATIONS), tone: "yes" };
    case "classic": {
      const a = pick(CLASSIC_ANSWERS);
      const q = question?.trim();
      return {
        headline: a.text,
        body: q
          ? `Re: "${q}"  -  the ball has spoken. Interpret freely.`
          : "No question needed. The ball still has opinions about you.",
        tone: a.tone,
      };
    }
  }
}
