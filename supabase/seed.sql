-- ============================================
-- TinyMilestones - Milestone Seed Data
-- CDC/AAP developmental milestones by age
-- ============================================

INSERT INTO public.milestones (age_months, domain, title, description, source) VALUES
-- 2 months
(2, 'Social-Emotional', 'Begins to smile at people', 'Shows social smile in response to faces and interaction', 'CDC'),
(2, 'Language', 'Coos and makes gurgling sounds', 'Produces vowel-like sounds in response to stimulation', 'CDC'),
(2, 'Cognitive', 'Pays attention to faces', 'Focuses on and follows faces with eyes', 'CDC'),
(2, 'Gross Motor', 'Holds head up during tummy time', 'Can briefly lift and hold head while on stomach', 'CDC'),

-- 4 months
(4, 'Social-Emotional', 'Smiles spontaneously', 'Smiles without external prompting, especially at people', 'CDC'),
(4, 'Language', 'Babbles with expression', 'Begins babbling and copies sounds heard', 'CDC'),
(4, 'Cognitive', 'Reaches for toy with one hand', 'Demonstrates hand-eye coordination and intentional reaching', 'CDC'),
(4, 'Fine Motor', 'Brings hands to mouth', 'Explores objects by bringing them to mouth', 'CDC'),
(4, 'Gross Motor', 'Pushes up on elbows during tummy time', 'Stronger upper body control', 'CDC'),

-- 6 months
(6, 'Social-Emotional', 'Recognizes familiar faces', 'Knows familiar people and begins to know if someone is a stranger', 'CDC'),
(6, 'Language', 'Responds to own name', 'Turns head or looks when name is called', 'CDC'),
(6, 'Cognitive', 'Looks at things nearby', 'Shows curiosity about things and tries to get things that are out of reach', 'CDC'),
(6, 'Fine Motor', 'Passes things from one hand to other', 'Demonstrates bilateral coordination', 'CDC'),
(6, 'Gross Motor', 'Rolls over in both directions', 'Can roll from back to tummy and tummy to back', 'CDC'),

-- 9 months
(9, 'Social-Emotional', 'May be afraid of strangers', 'Shows stranger anxiety and clings to familiar adults', 'CDC'),
(9, 'Language', 'Understands "no"', 'Responds to simple verbal commands', 'CDC'),
(9, 'Cognitive', 'Watches the path of something as it falls', 'Object tracking and beginning of object permanence', 'CDC'),
(9, 'Fine Motor', 'Picks up things with thumb and finger', 'Developing pincer grasp', 'CDC'),
(9, 'Gross Motor', 'Stands holding on', 'Pulls to standing position using furniture', 'CDC'),

-- 12 months
(12, 'Social-Emotional', 'Shows fear in some situations', 'Emotional awareness is developing', 'CDC'),
(12, 'Language', 'Says "mama" and "dada"', 'First intentional words with meaning', 'CDC'),
(12, 'Cognitive', 'Explores things in different ways', 'Shakes, bangs, throws objects to learn about them', 'CDC'),
(12, 'Fine Motor', 'Puts things in and out of containers', 'Beginning of purposeful placement', 'CDC'),
(12, 'Gross Motor', 'May take a few steps without holding on', 'Beginning of independent walking', 'CDC'),

-- 18 months
(18, 'Social-Emotional', 'May have temper tantrums', 'Emotional expression is developing, struggles with frustration', 'CDC'),
(18, 'Language', 'Says several single words', 'Vocabulary of 10-25 words', 'CDC'),
(18, 'Cognitive', 'Knows what ordinary things are for', 'Understands function of common objects like phone, spoon', 'CDC'),
(18, 'Fine Motor', 'Scribbles on own', 'Can hold crayon and make marks', 'CDC'),
(18, 'Gross Motor', 'Walks alone', 'Steady independent walking', 'CDC'),

-- 24 months
(24, 'Social-Emotional', 'Shows more independence', 'Wants to do things on their own', 'CDC'),
(24, 'Language', 'Points to things in a book', 'Can identify pictures and objects when named', 'CDC'),
(24, 'Language', 'Says sentences with 2-4 words', 'Beginning of sentence formation', 'CDC'),
(24, 'Cognitive', 'Begins to sort shapes and colors', 'Categorization skills emerging', 'CDC'),
(24, 'Fine Motor', 'Builds towers of 4 or more blocks', 'Improved hand-eye coordination and spatial awareness', 'CDC'),
(24, 'Gross Motor', 'Kicks a ball', 'Large motor coordination for kicking', 'CDC'),

-- 36 months (3 years)
(36, 'Social-Emotional', 'Takes turns in games', 'Beginning of cooperative play', 'CDC'),
(36, 'Language', 'Carries on a conversation using 2-3 sentences', 'Extended verbal communication', 'CDC'),
(36, 'Cognitive', 'Does puzzles with 3-4 pieces', 'Problem-solving and spatial reasoning', 'CDC'),
(36, 'Fine Motor', 'Turns pages one at a time', 'Fine motor control with thin objects', 'CDC'),
(36, 'Gross Motor', 'Climbs well', 'Advanced gross motor - climbing playground structures', 'CDC'),
(36, 'Gross Motor', 'Runs easily', 'Coordinated running without frequent falls', 'CDC'),

-- 48 months (4 years)
(48, 'Social-Emotional', 'Enjoys doing new things', 'Shows interest in novel experiences and creativity', 'CDC'),
(48, 'Language', 'Tells stories', 'Can narrate events and create simple stories', 'CDC'),
(48, 'Cognitive', 'Names some colors and numbers', 'Basic academic concepts emerging', 'CDC'),
(48, 'Fine Motor', 'Uses scissors', 'Can cut along a straight line', 'CDC'),
(48, 'Gross Motor', 'Hops on one foot', 'Advanced balance and coordination', 'CDC'),

-- 60 months (5 years)
(60, 'Social-Emotional', 'Wants to be like friends', 'Peer relationships become important', 'CDC'),
(60, 'Language', 'Speaks very clearly', 'Most speech is intelligible to strangers', 'CDC'),
(60, 'Cognitive', 'Counts 10 or more things', 'Numerical understanding developing', 'CDC'),
(60, 'Fine Motor', 'Draws a person with at least 6 body parts', 'Advanced drawing and representation skills', 'CDC'),
(60, 'Gross Motor', 'Can do a somersault', 'Complex gross motor coordination', 'CDC'),

-- 72 months (6 years)
(72, 'Social-Emotional', 'Understands the concept of "mine" and "theirs"', 'Developing sense of ownership and sharing', 'AAP'),
(72, 'Language', 'Retells a story in own words', 'Comprehension and verbal expression skills', 'AAP'),
(72, 'Cognitive', 'Understands the concept of time', 'Grasps today, tomorrow, yesterday', 'AAP'),
(72, 'Fine Motor', 'Writes some letters and numbers', 'Pre-writing skills developing', 'AAP'),
(72, 'Gross Motor', 'Skips and rides a bicycle', 'Complex coordinated movements', 'AAP');
