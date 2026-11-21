/**
 * 精选《和合本》（CUV）与英文（KJV）感恩、恩典与盼望主题经节库
 * 规范：每条以 1 节为标准，连续经节不超过 3 节。
 */
const GRATITUDE_VERSES = [
  {
    zh: { text: "你们要称谢耶和华，因他本为善；他的慈爱永远长存！", ref: "诗篇 107:1" },
    en: { text: "O give thanks unto the LORD, for he is good: for his mercy endureth for ever.", ref: "Psalm 107:1" }
  },
  {
    zh: { text: "要常常喜乐，不住地祷告，凡事谢恩；因为这是神在基督耶稣里向你们所定的旨意。", ref: "帖撒罗尼迦前书 5:16-18" },
    en: { text: "Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you.", ref: "1 Thessalonians 5:16-18" }
  },
  {
    zh: { text: "我的心哪，你要称颂耶和华！不可忘记他的一切恩惠！", ref: "诗篇 103:2" },
    en: { text: "Bless the LORD, O my soul, and forget not all his benefits.", ref: "Psalm 103:2" }
  },
  {
    zh: { text: "这是耶和华所定的日子，我们在其中要高兴欢喜！", ref: "诗篇 118:24" },
    en: { text: "This is the day which the LORD hath made; we will rejoice and be glad in it.", ref: "Psalm 118:24" }
  },
  {
    zh: { text: "感谢神，因他有说不尽的恩赐！", ref: "哥林多后书 9:15" },
    en: { text: "Thanks be unto God for his unspeakable gift.", ref: "2 Corinthians 9:15" }
  },
  {
    zh: { text: "应当一无挂虑，只要凡事藉着祷告、祈求和感谢，将你们所要的告诉神。神所赐、出人意外的平安，必在基督耶稣里保守你们的心怀意念。", ref: "腓立比书 4:6-7" },
    en: { text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.", ref: "Philippians 4:6-7" }
  },
  {
    zh: { text: "各样美善的恩赐和各样全备的赏赐都是从上头来的，从众光之父那里降下来的；在他并没有改变，也没有转动的影儿。", ref: "雅各书 1:17" },
    en: { text: "Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning.", ref: "James 1:17" }
  },
  {
    zh: { text: "我一生一世必有恩惠慈爱随着我；我且要住在耶和华的殿中，直到永远。", ref: "诗篇 23:6" },
    en: { text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.", ref: "Psalm 23:6" }
  },
  {
    zh: { text: "我们不致消灭，是出于耶和华诸般的慈爱；是因他的怜悯不致断绝。每早晨，这都是新的；你的诚实极其广大！", ref: "耶利米哀歌 3:22-23" },
    en: { text: "It is of the LORD'S mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.", ref: "Lamentations 3:22-23" }
  },
  {
    zh: { text: "我要一心称谢耶和华，在正直人的大会中，并公会中，也是如此。", ref: "诗篇 111:1" },
    en: { text: "I will praise the LORD with my whole heart, in the assembly of the upright, and in the congregation.", ref: "Psalm 111:1" }
  },
  {
    zh: { text: "凡以感谢献上为祭的，便是荣耀我；那按正路而行的，我必使他得着我的救恩。", ref: "诗篇 50:23" },
    en: { text: "Whoso offereth praise glorifieth me: and to him that ordereth his conversation aright will I shew the salvation of God.", ref: "Psalm 50:23" }
  },
  {
    zh: { text: "当称谢进入他的门；当赞美进入他的院。当感谢他，称颂他的名！", ref: "诗篇 100:4" },
    en: { text: "Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.", ref: "Psalm 100:4" }
  },
  {
    zh: { text: "耶和华是我的力量，是我的盾牌；我心里倚靠他就得帮助。所以我心中欢乐，我必用诗歌颂赞他。", ref: "诗篇 28:7" },
    en: { text: "The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.", ref: "Psalm 28:7" }
  },
  {
    zh: { text: "所以，我们既得了不能震动的国，就当感恩，照神所喜悦的，用虔诚、敬畏的心事奉神。", ref: "希伯来书 12:28" },
    en: { text: "Wherefore we receiving a kingdom which cannot be moved, let us have grace, whereby we may serve God acceptably with reverence and godly fear.", ref: "Hebrews 12:28" }
  },
  {
    zh: { text: "又要叫基督的平安在你们心里作主；你们也为此蒙召，归为一体；且要存感谢的心。", ref: "歌罗西书 3:15" },
    en: { text: "And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.", ref: "Colossians 3:15" }
  },
  {
    zh: { text: "耶和华啊，我要在万民中称谢你，在列邦中歌颂你！因为你的慈爱高及诸天，你的诚实达到穹苍。", ref: "诗篇 57:9-10" },
    en: { text: "I will praise thee, O Lord, among the people: I will sing unto thee among the nations. For thy mercy is great unto the heavens, and thy truth unto the clouds.", ref: "Psalm 57:9-10" }
  },
  {
    zh: { text: "你们要尝尝主恩的滋味，便知道他是美善；投靠他的人有福了！", ref: "诗篇 34:8" },
    en: { text: "O taste and see that the LORD is good: blessed is the man that trusteth in him.", ref: "Psalm 34:8" }
  },
  {
    zh: { text: "愿耶和华赐福给你，保护你。愿耶和华使他的脸光照你，赐恩给你。愿耶和华向你仰脸，赐你平安。", ref: "民数记 6:24-26" },
    en: { text: "The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace.", ref: "Numbers 6:24-26" }
  },
  {
    zh: { text: "你以恩典为年岁的冠冕；你的路径都滴下脂油。", ref: "诗篇 65:11" },
    en: { text: "Thou crownest the year with thy goodness; and thy paths drop fatness.", ref: "Psalm 65:11" }
  },
  {
    zh: { text: "但那等候耶和华的，必从新得力。他们必如鹰展翅上腾；他们奔跑却不困倦，行走却不疲乏。", ref: "以赛亚书 40:31" },
    en: { text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", ref: "Isaiah 40:31" }
  },
  {
    zh: { text: "你要专心仰赖耶和华，不可倚靠自己的聪明，在你一切所行的事上都要认定他，他必指引你的路。", ref: "箴言 3:5-6" },
    en: { text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.", ref: "Proverbs 3:5-6" }
  },
  {
    zh: { text: "耶和华是我的牧者，我必不致缺乏。", ref: "诗篇 23:1" },
    en: { text: "The LORD is my shepherd; I shall not want.", ref: "Psalm 23:1" }
  },
  {
    zh: { text: "我靠着那加给我力量的，凡事都能作。", ref: "腓立比书 4:13" },
    en: { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13" }
  },
  {
    zh: { text: "你们要将一切的忧虑卸给神，因为他顾念你们。", ref: "彼得前书 5:7" },
    en: { text: "Casting all your care upon him; for he careth for you.", ref: "1 Peter 5:7" }
  },
  {
    zh: { text: "天天背负我们重担的主，就是拯救我们的神，是应当称颂的！", ref: "诗篇 68:19" },
    en: { text: "Blessed be the Lord, who daily loadeth us with benefits, even the God of our salvation.", ref: "Psalm 68:19" }
  },
  {
    zh: { text: "因为神赐给我们，不是胆怯的心，乃是刚强、仁爱、谨守的心。", ref: "提摩太后书 1:7" },
    en: { text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.", ref: "2 Timothy 1:7" }
  },
  {
    zh: { text: "神为爱他的人所预备的是眼睛未曾看见，耳朵未曾听见，人心也未曾想到的。", ref: "哥林多前书 2:9" },
    en: { text: "Eye hath not seen, nor ear heard, neither have entered into the heart of man, the things which God hath prepared for them that love him.", ref: "1 Corinthians 2:9" }
  },
  {
    zh: { text: "无论作什么，或说话或行事，都要奉主耶稣的名，藉着他感谢父神。", ref: "歌罗西书 3:17" },
    en: { text: "And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God and the Father by him.", ref: "Colossians 3:17" }
  },
  {
    zh: { text: "他对我说：「我的恩典够你用的，因为我的能力是在人的软弱上显得完全。」", ref: "哥林多后书 12:9" },
    en: { text: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.", ref: "2 Corinthians 12:9" }
  },
  {
    zh: { text: "耶和华所赐的福使人富足，并不加上忧虑。", ref: "箴言 10:22" },
    en: { text: "The blessing of the LORD, it maketh rich, and he addeth no sorrow with it.", ref: "Proverbs 10:22" }
  }
];
