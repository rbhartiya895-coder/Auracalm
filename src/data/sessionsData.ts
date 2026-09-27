import { GuidedSession, BreathingPreset } from '../types';

export const BREATHING_PRESETS: BreathingPreset[] = [
  {
    id: 'calming-sigh',
    name: '4-2-6 Calming Exhale',
    description: 'Extended exhale signals the parasympathetic nervous system to lower heart rate and reduce cortisol.',
    inhale: 4,
    hold1: 2,
    exhale: 6,
    hold2: 0,
    benefit: 'Rapid de-escalation for acute anxiety, racing thoughts, or panic onset.'
  },
  {
    id: 'box-breathing',
    name: '4-4-4-4 Box Breathing',
    description: 'Equal duration across all four phases to regulate autonomic balance and restore executive control.',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    benefit: 'Used by first responders and clinical therapists for steady mental focus.'
  },
  {
    id: 'relaxing-478',
    name: '4-7-8 Deep Sleep & Rest',
    description: 'Dr. Andrew Weil technique that induces natural sedation and calms somatic tension.',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    benefit: 'Ideal for bedtime restlessness, nocturnal waking, and nervous exhaustion.'
  },
  {
    id: 'coherent-breathing',
    name: '5.5s Heart Coherence',
    description: 'Synchronizes heart rate variability (HRV) with respiration at 5.5 breaths per minute.',
    inhale: 5.5,
    hold1: 0,
    exhale: 5.5,
    hold2: 0,
    benefit: 'Optimizes emotional resilience and reduces systemic cardiovascular stress.'
  }
];

export const GUIDED_SESSIONS: GuidedSession[] = [
  {
    id: 'anxiety-anchor',
    title: 'Anxiety De-escalation & Safe Anchor',
    category: 'anxiety',
    categoryLabel: 'Crisis & Acute Anxiety',
    durationMinutes: 3,
    durationSeconds: 180,
    description: 'A rapid, trauma-informed grounding protocol to soften acute overwhelm, slow the racing pulse, and return your awareness to bodily safety.',
    benefits: ['Lowers acute sympathetic arousal', 'Re-establishes bodily safety', 'Stops panic thought loops'],
    instructor: 'Dr. Elena Vance, Somatic Clinical Psychologist',
    ambientSoundDefault: 'ocean',
    colorScheme: 'from-emerald-600 to-teal-800',
    tag: 'Quick Relief (3m)',
    steps: [
      {
        timeSeconds: 0,
        text: 'Welcome to this safe space. Whatever you are experiencing right now, it is temporary. You are safe in this moment.',
        action: 'Close your eyes or soften your gaze downward.'
      },
      {
        timeSeconds: 25,
        text: 'Feel the solid contact beneath your feet and thighs. Notice the ground supporting you without any effort from your side.',
        action: 'Press your feet gently into the floor.'
      },
      {
        timeSeconds: 55,
        text: 'Let us take a slow, gentle inhale through the nose... and an extended, soft sigh out through your mouth. Let your shoulders drop two inches.',
        action: 'Slow inhale... Long soft exhale.'
      },
      {
        timeSeconds: 95,
        text: 'Notice any tightness in your chest or jaw. Do not fight it. Simply place a warm hand over your heart or abdomen and let it be held.',
        action: 'Rest a warm hand on your chest.'
      },
      {
        timeSeconds: 135,
        text: 'Silently repeat with me: "I am safe right now. My nervous system is returning to balance. I have time."',
        action: 'Breathe with easy, steady rhythm.'
      },
      {
        timeSeconds: 165,
        text: 'You have done something deeply healing for yourself. Slowly wiggle your fingers and open your eyes when you feel ready.',
        action: 'Gentle stretch and soft arrival.'
      }
    ]
  },
  {
    id: 'somatic-vagus-reset',
    title: 'Vagus Nerve Reset & Somatic Unwinding',
    category: 'somatic',
    categoryLabel: 'Somatic Nervous System',
    durationMinutes: 5,
    durationSeconds: 300,
    description: 'Gentle neck, ocular, and diaphragmatic somatic movements designed to trigger the ventral vagal brake and downregulate hypervigilance.',
    benefits: ['Releases trapped muscular bracing', 'Stimulates cranial nerve X', 'Deep whole-body tranquility'],
    instructor: 'Julian Croft, Somatic Experiencing Practitioner',
    ambientSoundDefault: 'theta',
    colorScheme: 'from-teal-600 to-cyan-900',
    tag: 'Clinical Somatic (5m)',
    steps: [
      {
        timeSeconds: 0,
        text: 'Settle into a comfortable seated position. Keep your spine comfortably upright without strain.',
        action: 'Interlace your fingers behind the back of your head.'
      },
      {
        timeSeconds: 35,
        text: 'Without turning your head, gently shift both eyes all the way to the right. Keep looking right while breathing normally.',
        action: 'Look right with eyes only. Hold for 30 seconds until a swallow, sigh, or yawn occurs.'
      },
      {
        timeSeconds: 90,
        text: 'Notice if a natural swallow, sigh, or deep breath occurred. Now slowly bring your eyes back to center.',
        action: 'Rest in center. Feel the release across the suboccipital muscles.'
      },
      {
        timeSeconds: 130,
        text: 'Now, keeping your head facing forward, move your gaze completely to the left. Hold your eyes gently to the left.',
        action: 'Hold gentle gaze to the left. Allow your neck muscles to soften.'
      },
      {
        timeSeconds: 185,
        text: 'Release your hands down into your lap. Feel the warmth spreading down through your throat, chest, and diaphragm.',
        action: 'Lower hands. Feel the settling sensation.'
      },
      {
        timeSeconds: 230,
        text: 'Let out a soft, low humming sound on your next exhale. Feel the subtle vibration in your throat and chest.',
        action: 'Inhale gently, hum smoothly on the exhale: "Mmmmm".'
      },
      {
        timeSeconds: 275,
        text: 'Your nervous system has shifted into safety. Rest here in this calm equilibrium.',
        action: 'Rest and absorb the calm baseline.'
      }
    ]
  },
  {
    id: 'deep-rest-sleep',
    title: 'Restorative Sleep & Nervous System Unwind',
    category: 'sleep',
    categoryLabel: 'Sleep & Night Sanctuary',
    durationMinutes: 10,
    durationSeconds: 600,
    description: 'A deeply soothing progressive body softening and hypnotic wind-down designed to quiet racing thoughts and usher in restorative rest.',
    benefits: ['Quiets late-night rumination', 'Prepares the brain for delta-wave sleep', 'Dissolves physical tension'],
    instructor: 'Dr. Maya Lin, Sleep Medicine & Mindfulness',
    ambientSoundDefault: 'rain',
    colorScheme: 'from-indigo-900 via-slate-900 to-teal-950',
    tag: 'Deep Sleep (10m)',
    steps: [
      {
        timeSeconds: 0,
        text: 'Lie back comfortably. Allow the mattress to support the full weight of your body. There is nowhere else you need to be.',
        action: 'Dim the room lights. Let your arms rest beside you.'
      },
      {
        timeSeconds: 60,
        text: 'Take a slow, deep breath in... and as you exhale, imagine the air leaving through the soles of your feet, carrying with it all the hours of the day.',
        action: 'Deep exhale into the mattress.'
      },
      {
        timeSeconds: 140,
        text: 'Bring your awareness to your forehead and eyes. Allow the skin of your brow to smooth out, as if warm water were washing over it.',
        action: 'Unclench your eyebrows and let your eyelids feel heavy.'
      },
      {
        timeSeconds: 240,
        text: 'Let your lower jaw release slightly away from your upper teeth. Let your tongue rest softly on the floor of your mouth.',
        action: 'Drop the jaw and release the throat.'
      },
      {
        timeSeconds: 340,
        text: 'Feel the heaviness in your shoulders, your arms, and your hands. They have worked hard today. Now they are permitted to rest.',
        action: 'Feel heavy, warm sensations in both arms.'
      },
      {
        timeSeconds: 440,
        text: 'Each breath in is soft and effortless. Each breath out is an invitation to drift deeper into serene comfort.',
        action: 'Let the rhythm of breathing happen naturally.'
      },
      {
        timeSeconds: 530,
        text: 'Surrender all remaining thoughts into the quiet darkness. You are safe. Tomorrow will care for itself. Sleep gently.',
        action: 'Drift peacefully into slumber.'
      }
    ]
  },
  {
    id: 'morning-clarity',
    title: 'Mindful Morning Stillness & Grounded Intention',
    category: 'morning',
    categoryLabel: 'Morning & Energy',
    durationMinutes: 5,
    durationSeconds: 300,
    description: 'Begin your day from a place of grounded clarity rather than urgency. Anchor your intentions and wake up your senses with warmth.',
    benefits: ['Prevents morning cortisol spikes', 'Sets purposeful emotional tone', 'Enhances daily focus'],
    instructor: 'Kaelen Thorne, Mindfulness Educator',
    ambientSoundDefault: 'forest',
    colorScheme: 'from-emerald-700 to-teal-900',
    tag: 'Morning Anchor (5m)',
    steps: [
      {
        timeSeconds: 0,
        text: 'Good morning. Before you rush into tasks, give yourself this sacred container of stillness. You deserve this moment of peaceful arrival.',
        action: 'Sit comfortably with a lengthened, relaxed spine.'
      },
      {
        timeSeconds: 40,
        text: 'Inhale deeply, feeling your ribcage expand in 360 degrees. Exhale slowly, feeling both rooted and alert.',
        action: 'Take 3 expansive, refreshing breaths.'
      },
      {
        timeSeconds: 100,
        text: 'Notice the gift of this fresh morning. Today does not have to be rushed. You can move through it with grace and composure.',
        action: 'Place hands in your lap, palms upward.'
      },
      {
        timeSeconds: 160,
        text: 'What quality would you like to bring into today? Perhaps patience... clarity... ease... or resilience. Name it silently.',
        action: 'Silently choose one word as your daily anchor.'
      },
      {
        timeSeconds: 230,
        text: 'Breathe this intention deep into your heart space. As you go forward, return to this center whenever urgency arises.',
        action: 'Internalize your intention with an easy breath.'
      },
      {
        timeSeconds: 280,
        text: 'Bring a gentle smile to your face. Carry this calm clarity into your day.',
        action: 'Gently open your eyes and step forward with peace.'
      }
    ]
  },
  {
    id: 'body-scan-tension',
    title: 'Release Physical Bracing & Jaw Clench',
    category: 'somatic',
    categoryLabel: 'Body Scan & Release',
    durationMinutes: 7,
    durationSeconds: 420,
    description: 'Targeted release of the primary somatic stress storage points: the jaw, neck, shoulders, solar plexus, and lower back.',
    benefits: ['Relieves tension headaches & TMJ', 'Releases posture bracing', 'Restores natural diaphragm movement'],
    instructor: 'Dr. Elena Vance, Somatic Clinical Psychologist',
    ambientSoundDefault: 'bowl_drone',
    colorScheme: 'from-teal-800 to-emerald-950',
    tag: 'Tension Release (7m)',
    steps: [
      {
        timeSeconds: 0,
        text: 'Welcome. Our bodies often hold emotions and stress long after the mind has moved on. We are here to gently soften those knots.',
        action: 'Find a position where your neck and back can relax.'
      },
      {
        timeSeconds: 50,
        text: 'Bring your awareness to your jaw and temples. Gently massage your jaw muscles with your fingertips in small circular motions.',
        action: 'Circular fingertip massage along the jaw line.'
      },
      {
        timeSeconds: 120,
        text: 'Open your mouth slightly and exhale with an audible "Ahhh" sound, allowing your tongue to soften.',
        action: 'Exhale with a gentle "Ahhh" sound.'
      },
      {
        timeSeconds: 190,
        text: 'Roll your shoulders up toward your ears... and then slowly let them slide down and back. Notice the space created in your neck.',
        action: 'Slow shoulder roll up and down.'
      },
      {
        timeSeconds: 260,
        text: 'Place both hands on your lower belly. Feel the belly swell like a soft balloon on each inhale, and soften back on the exhale.',
        action: 'Belly rises with breath, releasing pelvic floor tension.'
      },
      {
        timeSeconds: 340,
        text: 'Scan your whole body from crown to toes. Whatever is still tight, say inwardly: "I give you permission to let go."',
        action: 'Full body scan with releasing awareness.'
      },
      {
        timeSeconds: 400,
        text: 'Rest in this lightness. Your body is relaxed, open, and supported.',
        action: 'Bask in muscular ease.'
      }
    ]
  },
  {
    id: 'compassion-in-overwhelm',
    title: 'Self-Compassion in Overwhelm & Self-Doubt',
    category: 'anxiety',
    categoryLabel: 'Emotional Care',
    durationMinutes: 6,
    durationSeconds: 360,
    description: 'When self-criticism or heavy emotions feel overwhelming, this practice offers the soothing warmth of Kristen Neff style mindful self-compassion.',
    benefits: ['Soothes the inner critic', 'Activates the mammalian care system', 'Reduces feelings of isolation'],
    instructor: 'Amara Chen, Compassion-Focused Therapist',
    ambientSoundDefault: 'ocean',
    colorScheme: 'from-rose-900/80 via-emerald-900 to-teal-950',
    tag: 'Self-Compassion (6m)',
    steps: [
      {
        timeSeconds: 0,
        text: 'Take a slow, comforting breath. If things feel hard right now, acknowledge it gently: "This is a moment of difficulty."',
        action: 'Place one hand on your chest, one hand on your belly.'
      },
      {
        timeSeconds: 60,
        text: 'Suffering and overwhelm are part of being human. You are not broken, you are not weak, and you are not alone in feeling this way.',
        action: 'Feel the soothing warmth of your hands on your body.'
      },
      {
        timeSeconds: 140,
        text: 'What words would you say to a dear friend who was hurting right now? Can you offer those exact words to yourself?',
        action: 'Whisper words of kindness inwardly to yourself.'
      },
      {
        timeSeconds: 220,
        text: 'Say inwardly: "May I be kind to myself. May I give myself the compassion I need. May I accept myself just as I am."',
        action: 'Repeat the three self-compassion phrases with ease.'
      },
      {
        timeSeconds: 300,
        text: 'Feel the soothing oxytocin release that comes from physical touch and self-kindness. You are doing the best you can with what you have.',
        action: 'Hold yourself in this gentle warmth.'
      },
      {
        timeSeconds: 345,
        text: 'Take this warmth with you into whatever comes next.',
        action: 'Soft release and gentle arrival.'
      }
    ]
  }
];
