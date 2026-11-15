/**
 * Gamification Service
 * Conforms to Section 5H of the ONBOARD Product Architecture & MVP Specification.
 * Provides configurable XP values, achievement definitions, and streak rules.
 */

export const XP_CONFIG = {
  FIRST_LESSON_COMPLETION: 20,
  LESSON_CHECKPOINT: 10,
  GUIDED_EXPERIMENT: 30,
  INDEPENDENT_CHALLENGE: 50,
  MODULE_COMPLETION: 75,
  REVIEW_SESSION: 10,
};

export const ACHIEVEMENTS = [
  {
    id: 'first_spark',
    title: 'First Spark',
    description: 'Complete your very first lesson on Onboard.',
    icon: '⚡',
    category: 'Getting Started',
    xpReward: 20,
  },
  {
    id: 'circuit_curious',
    title: 'Circuit Curious',
    description: 'Inspect 5 board pins or virtual electronic components.',
    icon: '🔍',
    category: 'Exploration',
    xpReward: 15,
  },
  {
    id: 'pin_detective',
    title: 'Pin Detective',
    description: 'Pass the ESP32 board explorer pinout checkpoint.',
    icon: '📌',
    category: 'Hardware',
    xpReward: 25,
  },
  {
    id: 'light_it_up',
    title: 'Light It Up',
    description: 'Successfully wire and run the virtual LED blink experiment.',
    icon: '💡',
    category: 'Virtual Lab',
    xpReward: 30,
  },
  {
    id: 'button_boss',
    title: 'Button Boss',
    description: 'Master digital inputs by building the button-controlled circuit.',
    icon: '🔘',
    category: 'Virtual Lab',
    xpReward: 30,
  },
  {
    id: 'bug_hunter',
    title: 'Bug Hunter',
    description: 'Diagnose and fix a seeded circuit error using Explain Mode.',
    icon: '🐞',
    category: 'Troubleshooting',
    xpReward: 35,
  },
  {
    id: 'analog_explorer',
    title: 'Analog Explorer',
    description: 'Read and map changing voltages from a potentiometer ADC.',
    icon: '🌊',
    category: 'Sensors',
    xpReward: 40,
  },
  {
    id: 'first_mission',
    title: 'First Mission',
    description: 'Complete the Smart Indicator beginner capstone project.',
    icon: '🏆',
    category: 'Milestones',
    xpReward: 75,
  },
  {
    id: 'consistent_builder',
    title: 'Consistent Builder',
    description: 'Maintain a 7-day learning streak.',
    icon: '🔥',
    category: 'Consistency',
    xpReward: 50,
  },
];
