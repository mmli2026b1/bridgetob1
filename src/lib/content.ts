// ─── Types ──────────────────────────────────────────────────────────

export type TopicFormField = {
  label: string;
  hint?: string;
};

export type VocabItem = {
  word: string;
  definition: string;
  example?: string;
};

export type ModelQA = {
  question: string;
  answer: string;
};

export type TopicContent = {
  slug: string;
  title: string;
  description: string;
  /** null = free preview, otherwise it's the chapter/section it belongs to */
  chapter?: string;
  emoji?: string;
  formFields?: TopicFormField[];
  vocabulary?: VocabItem[];
  modelQAs?: ModelQA[];
  usefulPhrases?: string[];
  tips?: string[];
};

// ─── Topics Data ────────────────────────────────────────────────────

export const topics: TopicContent[] = [
  // ─── FREE PREVIEW ────────────────────────────────────────────
  {
    slug: "family",
    title: "Family",
    description:
      "Talk about your family members, relationships, and family traditions — one of the most common B1 exam topics.",
    chapter: undefined, // free preview
    emoji: "👨‍👩‍👧‍👦",
    formFields: [
      { label: "How many people are in your family?", hint: "e.g. There are four people in my family." },
      { label: "Do you live with your family?", hint: "e.g. Yes, I live with my parents and my sister." },
      { label: "What do you like to do with your family?", hint: "e.g. We often watch films together on weekends." },
      { label: "Describe your mother/father.", hint: "e.g. My mother is kind and hardworking." },
      { label: "Do you have any siblings?", hint: "e.g. I have one older brother." },
    ],
    vocabulary: [
      { word: "immediate family", definition: "Parents, siblings, and children", example: "My immediate family includes my parents and my sister." },
      { word: "extended family", definition: "Relatives beyond immediate family (aunts, uncles, cousins, grandparents)", example: "I see my extended family during holidays." },
      { word: "close-knit", definition: "Having strong relationships with each other", example: "We are a close-knit family." },
      { word: "to take after", definition: "To resemble a family member in appearance or character", example: "I take after my father — we both love reading." },
      { word: "to get along with", definition: "To have a good relationship with someone", example: "I get along very well with my younger sister." },
      { word: "to bring up", definition: "To raise a child", example: "My parents brought me up to be honest." },
      { word: "to look up to", definition: "To admire and respect someone", example: "I really look up to my older brother." },
      { word: "to settle down", definition: "To start a stable life, often getting married", example: "I hope to settle down and have kids one day." },
    ],
    modelQAs: [
      {
        question: "Tell me about your family.",
        answer:
          "There are four people in my immediate family — my parents, my younger sister, and me. We live in a flat in the city centre. My father works as an engineer and my mother is a teacher. We are a very close-knit family and we always have dinner together in the evening. I also have grandparents who live in a village nearby, and we visit them every month.",
      },
      {
        question: "What do you like to do with your family?",
        answer:
          "On weekends, we enjoy watching films together or going for a walk in the park. During school holidays, we sometimes travel to the countryside to visit my grandparents. I also like cooking with my mother — she teaches me traditional recipes. These moments are very special to me because we spend quality time together.",
      },
      {
        question: "Do you get along well with your family?",
        answer:
          "Yes, generally I get along very well with all my family members. Of course, sometimes I argue with my sister about small things, but we always make up quickly. I think communication is very important in a family, and my parents always encourage us to talk about our feelings openly.",
      },
    ],
    usefulPhrases: [
      "There are … people in my family.",
      "I come from a … family. (small / large / close-knit)",
      "I take after my … because …",
      "I really look up to my … because …",
      "We get along well because …",
      "My … is the person I admire most because …",
      "I have a lot in common with my …",
      "Family means everything to me.",
    ],
  },

  // ─── PAID TOPICS ─────────────────────────────────────────────
  {
    slug: "job",
    title: "Job",
    description: "Discuss your job, your ambitions, and your ideal career path.",
    chapter: "Topics",
    emoji: "💼",
    formFields: [
      { label: "What is your dream job?", hint: "e.g. My dream job is to become a doctor." },
      { label: "What do you do in your current job?", hint: "e.g. I work as a customer service assistant." },
    ],
    vocabulary: [
      { word: "rewarding", definition: "Giving satisfaction and fulfillment", example: "I find teaching very rewarding." },
      { word: "to be promoted", definition: "To move to a higher position", example: "I hope to be promoted next year." },
      { word: "to earn a living", definition: "To make money to support yourself", example: "She earns a living as a freelance designer." },
      { word: "challenging", definition: "Difficult in a way that tests your abilities", example: "The job is challenging but exciting." },
      { word: "qualifications", definition: "Official exams or courses you have passed", example: "You need good qualifications for this role." },
    ],
    modelQAs: [
      {
        question: "What do you do for a living?",
        answer: "I work as a customer service assistant in a retail company. My main responsibilities include helping customers with their enquiries and processing orders. I've been working there for about two years now.",
      },
      {
        question: "What is your dream job?",
        answer: "My dream job is to become a graphic designer. I've always loved drawing and creating visual content. I'm currently taking an online course to improve my design skills, and I hope to start my own freelance business in the future.",
      },
    ],
    usefulPhrases: [
      "I work as a …",
      "My main responsibilities include …",
      "I've been working there for … years.",
      "My dream job is to become a …",
      "I find my work very … (rewarding / challenging / interesting)",
      "I hope to be promoted / start my own business in the future.",
    ],
  },
  {
    slug: "hobbies",
    title: "Hobbies",
    description: "Talk about your interests, free-time activities, and why you enjoy them.",
    chapter: "Topics",
    emoji: "🎨",
    formFields: [
      { label: "What do you do in your free time?", hint: "e.g. I like reading books and playing football." },
      { label: "How often do you do this hobby?", hint: "e.g. I play football twice a week." },
    ],
    vocabulary: [
      { word: "pastime", definition: "An activity you do for enjoyment", example: "Reading is my favourite pastime." },
      { word: "to take up", definition: "To start a new hobby", example: "I took up painting during the lockdown." },
      { word: "to be keen on", definition: "To be very interested in something", example: "I'm very keen on photography." },
      { word: "relaxing", definition: "Helping you feel calm and less stressed", example: "Listening to music is very relaxing for me." },
      { word: "the great outdoors", definition: "Countryside, natural environment", example: "I love spending time in the great outdoors." },
    ],
    modelQAs: [
      {
        question: "What are your hobbies?",
        answer: "I have several hobbies. I enjoy reading novels, especially mystery stories. I also like playing football with my friends on weekends. Recently, I took up photography, and I love taking pictures of nature and landscapes.",
      },
      {
        question: "Why do you enjoy these activities?",
        answer: "Reading helps me relax and learn new things at the same time. Football keeps me fit and I enjoy being part of a team. Photography allows me to be creative and capture beautiful moments. These hobbies balance my life and help me forget about stress.",
      },
    ],
    usefulPhrases: [
      "In my free time, I like to …",
      "I'm very keen on …",
      "I took up … recently.",
      "What I like about … is that …",
      "I find it very … (relaxing / exciting / interesting)",
      "I spend about … hours a week …",
    ],
  },
  {
    slug: "travel",
    title: "Travel",
    description: "Share your travel experiences, favourite destinations, and travel plans.",
    chapter: "Topics",
    emoji: "✈️",
    formFields: [
      { label: "Have you travelled abroad?", hint: "e.g. Yes, I have visited three countries." },
      { label: "Where would you like to go?", hint: "e.g. I would love to visit Japan." },
    ],
    vocabulary: [
      { word: "to go sightseeing", definition: "To visit tourist attractions", example: "We went sightseeing around the old town." },
      { word: "breathtaking", definition: "Extremely beautiful", example: "The view from the mountain was breathtaking." },
      { word: "destination", definition: "A place you travel to", example: "My dream destination is New Zealand." },
      { word: "to broaden your horizons", definition: "To experience new things that expand your knowledge", example: "Travelling broadens your horizons." },
      { word: "cultural experience", definition: "Experiencing the traditions and lifestyle of another place", example: "Trying local food is a great cultural experience." },
    ],
    modelQAs: [
      {
        question: "Do you like travelling?",
        answer: "Yes, I love travelling! It's one of my favourite things to do. I enjoy exploring new places, trying different foods, and meeting people from different cultures. Travelling broadens your horizons and helps you see the world from a new perspective.",
      },
      {
        question: "Tell me about a trip you enjoyed.",
        answer: "Last year, I visited Thailand with my family. We spent a week in Bangkok and another week at the beach in Phuket. The temples were breathtaking, and the food was delicious. It was an unforgettable experience because we did so many things together as a family.",
      },
    ],
    usefulPhrases: [
      "I love travelling because …",
      "My favourite destination so far has been …",
      "The most memorable trip I've ever taken was …",
      "I prefer … holidays. (beach / city / adventure / cultural)",
      "Travelling broadens your horizons.",
      "I hope to visit … one day.",
    ],
  },
  {
    slug: "my-country",
    title: "My Country",
    description: "Describe your country, its culture, traditions, and what makes it special.",
    chapter: "Topics",
    emoji: "🇬🇧",
    formFields: [
      { label: "Where is your country located?", hint: "e.g. My country is located in South Asia." },
      { label: "What is special about your country?", hint: "e.g. It is known for its rich culture and history." },
    ],
    vocabulary: [
      { word: "diverse", definition: "Having many different types of people or things", example: "My country has a very diverse culture." },
      { word: "heritage", definition: "Traditions and history passed down through generations", example: "We are proud of our cultural heritage." },
      { word: "landmark", definition: "A famous building or place", example: "The London Eye is a famous landmark." },
      { word: "multicultural", definition: "Including people from many different cultures", example: "Britain is a multicultural society." },
      { word: "to be located", definition: "To be situated in a particular place", example: "My country is located in Europe." },
    ],
    modelQAs: [
      {
        question: "Tell me about your country.",
        answer: "I am from India, a country located in South Asia. It is known for its rich cultural heritage, diverse languages, and delicious food. There are many famous landmarks like the Taj Mahal and the Red Fort. India is also known for festivals like Diwali and Holi, which are celebrated with great enthusiasm.",
      },
      {
        question: "What do you like most about your country?",
        answer: "What I like most about my country is its diversity. Every state has its own language, food, and traditions. I also appreciate how welcoming people are. Despite the differences, there is a strong sense of unity and community.",
      },
    ],
    usefulPhrases: [
      "My country is located in …",
      "It is known for …",
      "One thing I really like about my country is …",
      "A famous landmark in my country is …",
      "The people in my country are …",
      "My country is famous for its … (food / festivals / culture)",
    ],
  },
  {
    slug: "transport",
    title: "Transport",
    description: "Talk about how you get around, your preferred transport, and transport in your area.",
    chapter: "Topics",
    emoji: "🚌",
    formFields: [
      { label: "How do you get to work/school?", hint: "e.g. I take the bus to school." },
      { label: "What is public transport like in your area?", hint: "e.g. It is reliable and affordable." },
    ],
    vocabulary: [
      { word: "public transport", definition: "Buses, trains, etc. that anyone can use", example: "Public transport in my city is quite good." },
      { word: "commute", definition: "The journey to and from work", example: "My daily commute takes about 30 minutes." },
      { word: "reliable", definition: "Trustworthy — always works as expected", example: "The trains are usually reliable." },
      { word: "peak hours / rush hour", definition: "The busiest times for travel", example: "I avoid travelling during rush hour." },
      { word: "congestion", definition: "Too many vehicles causing slow traffic", example: "There is a lot of congestion in the city centre." },
    ],
    modelQAs: [
      {
        question: "How do you usually travel around?",
        answer: "I usually take the bus to go to work because it's convenient and affordable. The bus stop is just a five-minute walk from my house. Sometimes, when I'm in a hurry, I take a taxi or use a ride-sharing app like Uber.",
      },
      {
        question: "What is the transport like where you live?",
        answer: "Public transport in my area is fairly reliable. The buses run every 15 minutes during peak hours. However, during rush hour, there can be a lot of congestion, and the journey takes longer. I think the city could improve by adding more cycle lanes and expanding the metro system.",
      },
    ],
    usefulPhrases: [
      "I usually get to work/school by …",
      "The journey takes about … minutes.",
      "Public transport in my area is … (good / reliable / expensive)",
      "During rush hour, it can get very crowded.",
      "I prefer … because it's …",
      "I think the transport system could be improved by …",
    ],
  },
  {
    slug: "entertainment",
    title: "Entertainment",
    description: "Discuss films, TV shows, music, and how you like to be entertained.",
    chapter: "Topics",
    emoji: "🎬",
    formFields: [
      { label: "What do you do for entertainment?", hint: "e.g. I watch films and listen to music." },
      { label: "What kind of films do you like?", hint: "e.g. I prefer comedy and action films." },
    ],
    vocabulary: [
      { word: "blockbuster", definition: "A very successful and popular film", example: "Avatar was a huge blockbuster." },
      { word: "entertaining", definition: "Enjoyable and interesting", example: "I found the show very entertaining." },
      { word: "to be a fan of", definition: "To like something very much", example: "I'm a big fan of Marvel movies." },
      { word: "box office", definition: "The place where tickets are sold or how much money a film makes", example: "The film was a box office hit." },
      { word: "plot", definition: "The story of a film or book", example: "The plot was very gripping." },
    ],
    modelQAs: [
      {
        question: "What do you do for entertainment?",
        answer: "In my free time, I enjoy watching films and TV series, especially comedies and thrillers. I also like listening to music — I'm a big fan of pop and R&B. Sometimes I go to the cinema with my friends, or we stay at home and watch a film together.",
      },
      {
        question: "What kind of films do you prefer?",
        answer: "I prefer comedy and action films because they are entertaining and help me relax after a busy day. My favourite film is 'The Pursuit of Happyness' because it has an inspiring story. I also enjoy watching documentaries because I can learn new things.",
      },
    ],
    usefulPhrases: [
      "For entertainment, I usually …",
      "I'm a big fan of …",
      "My favourite film/TV show is … because …",
      "I find … very entertaining.",
      "I prefer … because …",
      "I would recommend … because …",
    ],
  },
  {
    slug: "special-occasions",
    title: "Special Occasions",
    description: "Talk about celebrations, parties, and meaningful events in your life.",
    chapter: "Topics",
    emoji: "🎉",
    formFields: [
      { label: "What is your favourite celebration?", hint: "e.g. My favourite celebration is my birthday." },
      { label: "How do you celebrate special occasions?", hint: "e.g. We have a party with family and friends." },
    ],
    vocabulary: [
      { word: "celebration", definition: "A special event to mark something important", example: "We had a big celebration for my grandmother's 80th birthday." },
      { word: "to throw a party", definition: "To organize a party", example: "My parents threw a party for my graduation." },
      { word: "memorable", definition: "Worth remembering, special", example: "It was a truly memorable evening." },
      { word: "tradition", definition: "Something people do regularly for a long time", example: "It's our family tradition to exchange gifts on New Year's Eve." },
      { word: "to gather", definition: "To come together in one place", example: "The whole family gathers for Christmas dinner." },
    ],
    modelQAs: [
      {
        question: "How do you celebrate special occasions?",
        answer: "For special occasions like birthdays and festivals, my family likes to throw a party at home. We invite close friends and relatives, and my mother cooks a big meal. We play music, dance, and take lots of photos. It's always a lot of fun.",
      },
      {
        question: "What was the most memorable celebration you've attended?",
        answer: "The most memorable celebration I've attended was my cousin's wedding. It was a big traditional ceremony that lasted three days. There was beautiful music, delicious food, and everyone was dressed in traditional clothes. The atmosphere was amazing and I will never forget it.",
      },
    ],
    usefulPhrases: [
      "My favourite celebration is …",
      "We usually celebrate … by …",
      "The most memorable celebration I've been to was …",
      "It's a tradition in my family to …",
      "I love the atmosphere during …",
      "What I enjoy most about celebrations is …",
    ],
  },
  {
    slug: "means-of-transport",
    title: "Means of Transport",
    description: "Compare different modes of transport and your preferences.",
    chapter: "Topics",
    emoji: "🚗",
    formFields: [
      { label: "What is the best way to travel in your city?", hint: "e.g. The metro is the best way to travel." },
      { label: "Do you prefer driving or taking public transport?", hint: "e.g. I prefer public transport because it's cheaper." },
    ],
    vocabulary: [
      { word: "convenient", definition: "Easy and suitable for your needs", example: "The metro is very convenient." },
      { word: "eco-friendly", definition: "Not harmful to the environment", example: "Cycling is an eco-friendly way to travel." },
      { word: "fares", definition: "The money you pay for a journey on public transport", example: "Bus fares have gone up recently." },
      { word: "to be stuck in traffic", definition: "To be delayed because of too many cars", example: "I was stuck in traffic for an hour." },
      { word: "pedestrian", definition: "Someone who is walking", example: "The city is very pedestrian-friendly." },
    ],
    modelQAs: [
      {
        question: "Which means of transport do you prefer and why?",
        answer: "I prefer the metro because it's fast, reliable, and avoids traffic congestion. It's also more affordable than driving, especially with the rising fuel prices. However, for short distances, I prefer walking because it's healthy and eco-friendly.",
      },
      {
        question: "What is the most popular means of transport in your country?",
        answer: "In my country, buses are the most common means of transport because they are cheap and connect most areas. In big cities, the metro is also very popular. Many people also use motorbikes or scooters because they are convenient for navigating through traffic.",
      },
    ],
    usefulPhrases: [
      "The most common means of transport in my area is …",
      "I prefer … because it's more … (convenient / affordable / eco-friendly)",
      "The problem with … is that …",
      "Compared to …, … is …",
      "I think the best way to get around is …",
    ],
  },
  {
    slug: "music",
    title: "Music",
    description: "Share your taste in music, favourite artists, and why music matters to you.",
    chapter: "Topics",
    emoji: "🎵",
    formFields: [
      { label: "What kind of music do you like?", hint: "e.g. I like pop and classical music." },
      { label: "Who is your favourite singer or band?", hint: "e.g. My favourite singer is Adele." },
    ],
    vocabulary: [
      { word: "genre", definition: "A style or category of music", example: "My favourite genre is R&B." },
      { word: "catchy", definition: "Easy to remember and enjoyable", example: "The song has a very catchy tune." },
      { word: "lyrics", definition: "The words of a song", example: "I love the lyrics of this song — they are very meaningful." },
      { word: "live performance", definition: "A concert where musicians perform in front of an audience", example: "I went to a live performance last weekend." },
      { word: "to have a good voice", definition: "To sing well", example: "She has a really good voice." },
    ],
    modelQAs: [
      {
        question: "What kind of music do you like?",
        answer: "I enjoy listening to pop and R&B music. My favourite artist is Ed Sheeran because his songs have meaningful lyrics and catchy tunes. I also like classical music when I need to concentrate or study — it helps me relax.",
      },
      {
        question: "How does music affect your mood?",
        answer: "Music has a big influence on my mood. When I'm feeling sad, listening to uplifting songs makes me feel better. When I need energy, I listen to fast-paced music. Music also helps me focus when I'm studying. I honestly can't imagine my life without music.",
      },
    ],
    usefulPhrases: [
      "My favourite genre of music is …",
      "I listen to music when I …",
      "My favourite singer/band is … because …",
      "The song that means the most to me is …",
      "Music makes me feel …",
      "I enjoy both … and … (e.g. listening to music and playing an instrument)",
    ],
  },
  {
    slug: "recent-experiences",
    title: "Recent Experiences",
    description: "Describe recent events in your life and how they affected you.",
    chapter: "Topics",
    emoji: "🌟",
    formFields: [
      { label: "What have you done recently?", hint: "e.g. I recently started a new course." },
      { label: "What was your most memorable recent experience?", hint: "e.g. I visited a new city last month." },
    ],
    vocabulary: [
      { word: "recently", definition: "Not long ago", example: "I recently started learning to play the guitar." },
      { word: "an unforgettable experience", definition: "An experience you will always remember", example: "Visiting the Grand Canyon was an unforgettable experience." },
      { word: "to try something new", definition: "To do something you haven't done before", example: "I tried something new and went scuba diving." },
      { word: "to achieve a goal", definition: "To succeed in doing what you planned", example: "I achieved my goal of running 5 km." },
      { word: "a life-changing event", definition: "An event that significantly changes your life", example: "Moving to a new city was a life-changing event for me." },
    ],
    modelQAs: [
      {
        question: "Tell me about something you did recently.",
        answer: "Recently, I completed a two-week English course, which was a great experience. I improved my speaking skills and made new friends from different countries. The teachers were very supportive, and the classes were interactive and fun.",
      },
      {
        question: "What is the most exciting thing you've done in the past year?",
        answer: "The most exciting thing I've done this year was visiting a famous historical city. I had always wanted to go there, and finally, I made it happen. I explored the old town, tried local dishes, and learned about the history. It was an unforgettable experience.",
      },
    ],
    usefulPhrases: [
      "Recently, I've been …",
      "Last month/week, I …",
      "It was an unforgettable experience because …",
      "What made it special was …",
      "I will always remember …",
      "This experience taught me …",
    ],
  },
  {
    slug: "festivals",
    title: "Festivals",
    description: "Discuss important festivals in your country and how you celebrate them.",
    chapter: "Topics",
    emoji: "🎊",
    formFields: [
      { label: "What is the most important festival in your country?", hint: "e.g. Diwali is the most important festival." },
      { label: "How do you prepare for festivals?", hint: "e.g. We clean the house and buy new clothes." },
    ],
    vocabulary: [
      { word: "to celebrate", definition: "To mark a special occasion with activities", example: "We celebrate Christmas every year." },
      { word: "festive spirit", definition: "The happy atmosphere during a festival", example: "The whole city is full of festive spirit." },
      { word: "decorations", definition: "Things used to make a place look attractive", example: "We put up decorations around the house." },
      { word: "traditional", definition: "Relating to old customs and ways of doing things", example: "We wear traditional clothes during the festival." },
      { word: "fireworks", definition: "Explosive displays of light and colour in the sky", example: "The fireworks at midnight were spectacular." },
    ],
    modelQAs: [
      {
        question: "What is your favourite festival?",
        answer: "My favourite festival is Diwali, which is also known as the Festival of Lights. It usually falls in October or November. During Diwali, we decorate our homes with lamps and candles, wear new clothes, and share sweets with neighbours. The best part is the fireworks display at night.",
      },
      {
        question: "How do you celebrate festivals in your country?",
        answer: "In my country, festivals are celebrated with great enthusiasm. Families gather together, prepare special meals, and visit each other's homes. There are also cultural events like music and dance performances. Festivals bring people together and create a wonderful sense of community.",
      },
    ],
    usefulPhrases: [
      "The most important festival in my country is …",
      "We celebrate it by …",
      "During the festival, we usually …",
      "The best thing about this festival is …",
      "It is celebrated in (month/season).",
      "Festivals are important because they bring families and communities together.",
    ],
  },
];

// ─── EXTRA CONTENT (paid) ─────────────────────────────────────────

export const extraContent = [
  {
    slug: "grammar",
    title: "Grammar Chapter",
    description: "Key grammar points you need for the B1 speaking exam — tenses, conditionals, and more.",
    chapter: "Extra Resources",
    emoji: "📚",
    tips: [
      "Present Simple: Use for facts and routines — 'I live in London.'",
      "Present Continuous: Use for now or near future — 'I am studying for my exam.'",
      "Past Simple: Use for finished past actions — 'I visited my grandmother yesterday.'",
      "Present Perfect: Use for life experiences — 'I have never been to Japan.'",
      "Future with 'going to': Use for plans — 'I am going to apply for a new job.'",
      "Future with 'will': Use for spontaneous decisions — 'I'll help you with that.'",
      "First Conditional: 'If I study hard, I will pass the exam.'",
      "Second Conditional: 'If I had more time, I would learn another language.'",
      "Comparative adjectives: 'This book is more interesting than that one.'",
      "Superlative adjectives: 'This is the best restaurant in town.'",
      "Modal verbs: 'can' (ability), 'should' (advice), 'must' (obligation)",
      "Linking words: 'However', 'Moreover', 'In addition', 'On the other hand'",
    ],
  },
  {
    slug: "rescue-sentences",
    title: "Rescue Sentences",
    description: "Lifesaver phrases to use when you get stuck during the speaking exam.",
    chapter: "Extra Resources",
    emoji: "🆘",
    usefulPhrases: [
      "Could you repeat that, please?",
      "Sorry, I didn't quite understand that.",
      "Let me think about that for a moment…",
      "That's a good question. Well…",
      "In other words…",
      "What I'm trying to say is…",
      "How can I put this?…",
      "To be honest, I've never really thought about that before.",
      "If I understood the question correctly,…",
      "I'm not sure I can give you a definite answer, but…",
      "Could you give me an example?",
      "Let me clarify what I mean.",
      "Do you mean…?",
      "I'd like to add something to what I said earlier.",
      "To sum up,…",
    ],
  },
  {
    slug: "test-day-tips",
    title: "Test-Day Tips",
    description: "Practical advice to help you stay calm, focused, and perform your best on exam day.",
    chapter: "Extra Resources",
    emoji: "✅",
    tips: [
      "Arrive at the test centre at least 30 minutes early.",
      "Bring your ID, confirmation letter, and a bottle of water.",
      "Dress comfortably — you'll be more relaxed.",
      "Listen carefully to the examiner's instructions.",
      "Don't memorise answers — examiners can tell. Focus on natural communication.",
      "If you don't understand a question, ask the examiner to repeat it.",
      "Speak clearly and at a natural pace. Don't rush.",
      "Use a range of vocabulary — show the examiner what you know.",
      "If you make a mistake, don't panic. Correct yourself and continue.",
      "Use fillers like 'Well…' or 'Let me think…' to give yourself time.",
      "Always give full answers — not just 'yes' or 'no'.",
      "Smile and make eye contact — it shows confidence.",
      "Breathe deeply if you feel nervous.",
      "Remember: the examiner wants you to do well!",
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────

export function getTopicBySlug(slug: string): TopicContent | undefined {
  return [...topics, ...extraContent].find((t) => t.slug === slug);
}

export function getFreeTopics(): TopicContent[] {
  return topics.filter((t) => t.chapter === undefined);
}

export function getPaidTopics(): TopicContent[] {
  return topics.filter((t) => t.chapter !== undefined);
}

export function getChapterGroups(): { chapter: string; topics: TopicContent[] }[] {
  const grouped: Record<string, TopicContent[]> = {};

  for (const topic of topics) {
    const chapter = topic.chapter ?? "Free Preview";
    if (!grouped[chapter]) grouped[chapter] = [];
    grouped[chapter].push(topic);
  }

  return Object.entries(grouped).map(([chapter, chapterTopics]) => ({
    chapter,
    topics: chapterTopics,
  }));
}
