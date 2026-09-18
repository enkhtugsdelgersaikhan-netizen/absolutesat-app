const words=[
    ["Abate", "adj", "Academic", "to become less intense or widespread"],
    ["Abbreviate", "verb", "Academic", "to shorten by leaving out parts"],
    ["Aberration", "noun", "Academic", "a departure from what is normal or expected"],
    ["Adept", "adj", "Academic", "highly skilled or proficient"],
    ["Adverse", "adj", "Academic", "harmful or unfavorable"],
    ["Aesthetic", "adj", "Academic", "concerned with beauty or artistic appearance"],
    ["Albeit", "conj", "Academic", "although or even though"],
    ["Allocate", "verb", "Academic", "to distribute for a particular purpose"],
    ["Analogous", "adj", "Academic", "similar in a relevant way"],
    ["Ambivalent", "adj", "Academic", "having mixed or conflicting feelings"],
    ["Ameliorate", "verb", "Academic", "to make something better or less severe"],
    ["Apparent", "adj", "Academic", "clear or seemingly true from available evidence"],
    ["Arbitrary", "adj", "Academic", "based on random choice rather than a clear reason"],
    ["Astute", "adj", "Academic", "quick to notice and understand important details"],
    ["Augment", "verb", "Academic", "to increase or strengthen"],
    ["Austere", "adj", "Academic", "plain, strict, or lacking luxury"],
    ["Banal", "adj", "Academic", "so ordinary that it is uninteresting"],
    ["Bolster", "verb", "Academic", "to support or strengthen"],
    ["Brevity", "noun", "Academic", "the use of few words to express an idea"],
    ["Catalyst", "noun", "Academic", "something that causes or accelerates change"],
    ["Cohesive", "adj", "Academic", "closely connected and forming a unified whole"],
    ["Coherent", "adj", "Academic", "logical and consistent"],
    ["Comprehensive", "adj", "Academic", "covering a broad range of relevant material"],
    ["Concise", "adj", "Academic", "expressing much in few words"],
    ["Conducive", "adj", "Academic", "helpful in bringing about a desired result"],
    ["Conventional", "adj", "Academic", "based on customary or widely accepted practice"],
    ["Cumulative", "adj", "Academic", "increasing through successive additions"],
    ["Daunt", "verb", "Academic", "to make someone feel intimidated or discouraged"],
    ["Deference", "noun", "Academic", "respectful submission to another's judgment or authority"],
    ["Delineate", "verb", "Academic", "to describe or mark something precisely"],
    ["Demarcate", "verb", "Academic", "to set clear boundaries around something"],
    ["Divergent", "adj", "Academic", "developing in different directions"],
    ["Elicit", "verb", "Academic", "to draw out a response or information"],
    ["Elucidate", "verb", "Academic", "to make something clearer or easier to understand"],
    ["Empirical", "adj", "Academic", "based on observation or experiment"],
    ["Encompass", "verb", "Academic", "to include or surround a broad range"],
    ["Endeavor", "noun", "Academic", "a serious effort or undertaking"],
    ["Eradicate", "verb", "Academic", "to remove or destroy completely"],
    ["Explicit", "adj", "Academic", "stated clearly and directly"],
    ["Facilitate", "verb", "Academic", "to make an action or process easier"],
    ["Feasible", "adj", "Academic", "possible and practical to accomplish"],
    ["Fluctuate", "verb", "Academic", "to vary repeatedly rather than remain constant"],
    ["Formidable", "adj", "Academic", "difficult to overcome or deal with"],
    ["Fundamental", "adj", "Academic", "basic and essential to a system or idea"],
    ["Inherent", "adj", "Academic", "existing naturally as an essential part of something"],
    ["Innovative", "adj", "Academic", "introducing new ideas or methods"],
    ["Integral", "adj", "Academic", "necessary to make a whole complete"],
    ["Intrinsic", "adj", "Academic", "belonging naturally to the essential nature of something"],
    ["Lucid", "adj", "Academic", "clear and easy to understand"],
    ["Marginal", "adj", "Academic", "small, limited, or at the edge of importance"],
    ["Mediate", "verb", "Academic", "to help settle a disagreement or stand between things"],
    ["Meticulous", "adj", "Academic", "extremely careful and precise"],
    ["Novel", "adj", "Academic", "new, original, or unusual"],
    ["Obsolete", "adj", "Academic", "no longer useful or current"],
    ["Pervasive", "adj", "Academic", "spread widely throughout a place or group"],
    ["Pragmatic", "adj", "Academic", "focused on practical results"],
    ["Preliminary", "adj", "Academic", "coming before the main stage or final decision"],
    ["Prolific", "adj", "Academic", "producing a large amount of work or output"],
    ["Proponent", "noun", "Academic", "a person who supports an idea or proposal"],
    ["Rigorous", "adj", "Academic", "thorough, exact, and demanding"],
    ["Robust", "adj", "Academic", "strong and able to withstand difficulty or variation"],
    ["Scrutinize", "verb", "Academic", "to examine closely and critically"],
    ["Sophisticated", "adj", "Academic", "highly developed, complex, or refined"],
    ["Subsequent", "adj", "Academic", "coming after something else in time or order"],
    ["Substantive", "adj", "Academic", "important and dealing with the essential matter"],
    ["Synthesize", "verb", "Academic", "to combine separate parts into a larger whole"],
    ["Tangible", "adj", "Academic", "real, concrete, and capable of being clearly identified"],
    ["Tentative", "adj", "Academic", "uncertain or not yet final"],
    ["Ubiquitous", "adj", "Academic", "present or encountered almost everywhere"],
    ["Undermine", "verb", "Academic", "to weaken gradually or indirectly"],
    ["Validate", "verb", "Academic", "to confirm that something is sound or legitimate"],
    ["Viable", "adj", "Academic", "capable of working successfully"],
    ["Wary", "adj", "Academic", "cautious because of possible problems"],
    ["Widespread", "adj", "Academic", "found or occurring over a large area or among many people"],
    ["Ambiguous", "adj", "Academic", "open to more than one interpretation"],
    ["Astounding", "adj", "Academic", "extremely surprising or impressive"],
    ["Canonical", "adj", "Academic", "accepted as an authoritative or standard example"],
    ["Capacious", "adj", "Academic", "having a lot of space or capacity"],
    ["Conceivable", "adj", "Academic", "possible to imagine or accept as possible"],
    ["Consecutive", "adj", "Academic", "following one after another without interruption"],
    ["Contemporary", "adj", "Academic", "belonging to the same time period or the present"],
    ["Contrive", "verb", "Academic", "to devise or arrange deliberately, often with ingenuity"],
    ["Corollary", "noun", "Academic", "a result that follows naturally from another fact"],
    ["Deplete", "verb", "Academic", "to use up a resource substantially"],
    ["Discrete", "adj", "Academic", "separate and distinct rather than continuous"],
    ["Disparate", "adj", "Academic", "fundamentally different or difficult to compare"],
    ["Dynamic", "adj", "Academic", "characterized by change, activity, or development"],
    ["Extrapolate", "verb", "Academic", "to estimate beyond known data using an observed pattern"],
    ["Facile", "adj", "Academic", "too simple or confident about a complicated issue"],
    ["Impartial", "adj", "Academic", "not favoring one side"],
    ["Incisive", "adj", "Academic", "clear and direct in identifying important points"],
    ["Incongruous", "adj", "Academic", "out of place or inconsistent with surroundings"],
    ["Intractable", "adj", "Academic", "very difficult to control or solve"],
    ["Malleable", "adj", "Academic", "easily influenced, shaped, or changed"],
    ["Nuance", "noun", "Academic", "a subtle distinction or variation"],
    ["Objective", "adj", "Academic", "not influenced by personal feelings or bias"],
    ["Paradigm", "noun", "Academic", "a model or framework for understanding something"],
    ["Plausible", "adj", "Academic", "seeming reasonable or possible"],
    ["Prevail", "verb", "Academic", "to prove more successful or widespread"],
    ["Profound", "adj", "Academic", "very deep, important, or far-reaching"],
    ["Reconcile", "verb", "Academic", "to bring apparently conflicting things into agreement"],
    ["Reinforce", "verb", "Academic", "to strengthen or support"],
    ["Salient", "adj", "Academic", "most noticeable or important"],
    ["Scrupulous", "adj", "Academic", "careful to follow rules or act honestly"],
    ["Sequester", "verb", "Academic", "to isolate or set apart"],
    ["Subtle", "adj", "Academic", "not obvious or easy to detect"],
    ["Terse", "adj", "Academic", "brief and direct, sometimes seeming abrupt"],
    ["Transformative", "adj", "Academic", "causing a major change"],
    ["Unprecedented", "adj", "Academic", "never occurring or existing before"],
    ["Versatile", "adj", "Academic", "able to adapt to many uses or activities"],
    ["Arduous", "adj", "Academic", "requiring much effort or endurance"],
    ["Commensurate", "adj", "Academic", "matching something in size, degree, or proportion"],
    ["Conclusive", "adj", "Academic", "settling an issue with convincing evidence"],
    ["Corroborate", "verb", "Academic", "to confirm with additional evidence"],
    ["Discern", "verb", "Academic", "to recognize or distinguish something"],
    ["Disseminate", "verb", "Academic", "to spread information widely"],
    ["Egregious", "adj", "Academic", "remarkably bad or glaringly wrong"],
    ["Exemplary", "adj", "Academic", "serving as a model of excellence"],
    ["Exhaustive", "adj", "Academic", "including all relevant possibilities or details"],
    ["Inferred", "adj", "Academic", "reached through reasoning from evidence"],
    ["Intermittent", "adj", "Academic", "occurring at irregular intervals rather than continuously"],
    ["Monotonous", "adj", "Academic", "lacking variation and therefore tedious"],
    ["Pivotal", "adj", "Academic", "of crucial importance to an outcome"],
    ["Preclude", "verb", "Academic", "to prevent something from happening"],
    ["Provisional", "adj", "Academic", "temporary and subject to change"],
    ["Refine", "verb", "Academic", "to improve by making small changes"],
    ["Resilient", "adj", "Academic", "able to recover after difficulty"],
    ["Rigidity", "noun", "Academic", "lack of flexibility or willingness to change"],
    ["Subordinate", "adj", "Academic", "lower in rank or importance"],
    ["Trivial", "adj", "Academic", "of little importance"],
    ["Unify", "verb", "Academic", "to bring together into one whole"],
    ["Utilitarian", "adj", "Academic", "designed mainly for practical usefulness"],
    ["Acumen", "noun", "Academic", "the ability to make good judgments quickly"],
    ["Adroit", "adj", "Academic", "skillful and effective in handling situations"],
    ["Bifurcate", "verb", "Academic", "to divide into two branches or parts"],
    ["Convoluted", "adj", "Academic", "complicated in a difficult-to-follow way"],
    ["Corroborative", "adj", "Academic", "providing support for a claim or finding"],
    ["Discerning", "adj", "Academic", "showing good judgment about subtle differences"],
    ["Ephemeral", "adj", "Academic", "lasting only a short time"],
    ["Equivocal", "adj", "Academic", "unclear or deliberately noncommittal"],
    ["Exemplify", "verb", "Academic", "to illustrate by being a typical example"],
    ["Foster", "verb", "Academic", "to encourage development or growth"],
    ["Idiosyncratic", "adj", "Academic", "peculiar to an individual or system"],
    ["Impetus", "noun", "Academic", "a force that causes an action or change"],
    ["Inhibit", "verb", "Academic", "to restrain or prevent an action"],
    ["Juxtapose", "verb", "Academic", "to place things close together for comparison or contrast"],
    ["Lucidity", "noun", "Academic", "clarity of expression or thought"],
    ["Mediocre", "adj", "Academic", "of only moderate quality"],
    ["Precarious", "adj", "Academic", "not secure or stable and likely to fail"],
    ["Proximity", "noun", "Academic", "nearness in place, time, or relationship"],
    ["Requisite", "adj", "Academic", "required or necessary"],
    ["Rescind", "verb", "Academic", "to officially cancel or withdraw"],
    ["Sparse", "adj", "Academic", "thinly scattered or limited in amount"],
    ["Stagnant", "adj", "Academic", "showing little or no growth or movement"],
    ["Sporadic", "adj", "Academic", "occurring irregularly and infrequently"],
    ["Stringent", "adj", "Academic", "very strict or demanding"],
    ["Tacit", "adj", "Academic", "understood without being directly stated"],
    ["Tenacious", "adj", "Academic", "persistent and unwilling to give up"],
    ["Venerate", "verb", "Academic", "to regard with great respect"],
    ["Advocate", "verb", "Argument", "to publicly support an idea or course of action"],
    ["Affirm", "verb", "Argument", "to state confidently that something is true"],
    ["Allege", "verb", "Argument", "to claim something without yet proving it"],
    ["Assert", "verb", "Argument", "to state a position forcefully or confidently"],
    ["Attest", "verb", "Argument", "to provide evidence that something is true"],
    ["Acknowledge", "verb", "Argument", "to recognize a fact or point as valid"],
    ["Challenge", "verb", "Argument", "to question or dispute a claim or assumption"],
    ["Concede", "verb", "Argument", "to admit that a point is valid, often despite disagreement"],
    ["Contradict", "verb", "Argument", "to state that something is false or inconsistent"],
    ["Contend", "verb", "Argument", "to argue or maintain that something is true"],
    ["Counter", "verb", "Argument", "to respond to a claim with an opposing point"],
    ["Critique", "verb", "Argument", "to analyze and evaluate strengths and weaknesses"],
    ["Debunk", "verb", "Argument", "to expose a claim as false or unsupported"],
    ["Defend", "verb", "Argument", "to support a position against criticism"],
    ["Deny", "verb", "Argument", "to declare that something is not true"],
    ["Discredit", "verb", "Argument", "to cause something to be regarded as untrustworthy or false"],
    ["Dismiss", "verb", "Argument", "to reject something as unworthy of consideration"],
    ["Dispute", "verb", "Argument", "to question the truth or validity of something"],
    ["Distort", "verb", "Argument", "to twist information away from its accurate form"],
    ["Elaborate", "verb", "Argument", "to explain an idea in greater detail"],
    ["Emphasize", "verb", "Argument", "to give special importance or attention to something"],
    ["Endorse", "verb", "Argument", "to express approval or support"],
    ["Entail", "verb", "Argument", "to involve something as a necessary consequence"],
    ["Exaggerate", "verb", "Argument", "to represent something as greater or more extreme than it is"],
    ["Hedge", "verb", "Argument", "to avoid committing fully to a claim"],
    ["Imply", "verb", "Argument", "to communicate indirectly without stating explicitly"],
    ["Infer", "verb", "Argument", "to reach a conclusion from evidence and reasoning"],
    ["Invoke", "verb", "Argument", "to call upon an idea, rule, or principle as support"],
    ["Justify", "verb", "Argument", "to provide reasons or evidence that make something defensible"],
    ["Maintain", "verb", "Argument", "to continue to argue or assert a position"],
    ["Misconstrue", "verb", "Argument", "to interpret something incorrectly"],
    ["Negate", "verb", "Argument", "to cancel out or make ineffective"],
    ["Object", "verb", "Argument", "to express disagreement or opposition"],
    ["Paraphrase", "verb", "Argument", "to restate an idea in different words"],
    ["Qualify", "verb", "Argument", "to limit or modify a statement"],
    ["Rationalize", "verb", "Argument", "to give a plausible explanation for something, often after the fact"],
    ["Refute", "verb", "Argument", "to show that a claim is false or untenable"],
    ["Reiterate", "verb", "Argument", "to state something again for emphasis or clarity"],
    ["Rebut", "verb", "Argument", "to argue against a claim or criticism"],
    ["Revoke", "verb", "Argument", "to officially withdraw or cancel"],
    ["Specify", "verb", "Argument", "to state or identify precisely"],
    ["Substantiate", "verb", "Argument", "to support a claim with evidence"],
    ["Summarize", "verb", "Argument", "to state the main points briefly"],
    ["Undercut", "verb", "Argument", "to weaken the force of a claim"],
    ["Verify", "verb", "Argument", "to establish that something is accurate or true"],
    ["Warrant", "verb", "Argument", "to justify or make something reasonable to do"],
    ["Ambiguity", "noun", "Argument", "the quality of allowing multiple interpretations"],
    ["Assertion", "noun", "Argument", "a confident statement of belief or fact"],
    ["Assumption", "noun", "Argument", "something accepted as true without proof"],
    ["Bias", "noun", "Argument", "a tendency to favor one side or perspective"],
    ["Caveat", "noun", "Argument", "a warning or condition that limits a claim"],
    ["Claim", "noun", "Argument", "a statement presented as true or defensible"],
    ["Counterargument", "noun", "Argument", "a point that challenges an opposing claim"],
    ["Credibility", "noun", "Argument", "the quality of being trusted or believed"],
    ["Deduction", "noun", "Argument", "a conclusion reached from stated premises"],
    ["Fallacy", "noun", "Argument", "an error in reasoning that weakens an argument"],
    ["Inference", "noun", "Argument", "a conclusion drawn from available evidence"],
    ["Implication", "noun", "Argument", "an idea or consequence suggested rather than directly stated"],
    ["Justification", "noun", "Argument", "a reason or evidence offered to support a position"],
    ["Logic", "noun", "Argument", "reasoning that follows coherent principles"],
    ["Merit", "noun", "Argument", "quality or value deserving recognition"],
    ["Objection", "noun", "Argument", "a reason for disagreeing with a claim or proposal"],
    ["Premise", "noun", "Argument", "a statement or assumption used to support a conclusion"],
    ["Rationale", "noun", "Argument", "the underlying reason or reasoning for something"],
    ["Rebuttal", "noun", "Argument", "a response that counters a claim or argument"],
    ["Reasoning", "noun", "Argument", "the process of forming conclusions through logic and evidence"],
    ["Relevance", "noun", "Argument", "connection to the issue being considered"],
    ["Stance", "noun", "Argument", "a person's position on an issue"],
    ["Validity", "noun", "Argument", "the quality of being logically sound or well-founded"],
    ["Contrary", "adj", "Argument", "opposite in nature or direction"],
    ["Credible", "adj", "Argument", "worthy of being believed"],
    ["Defensible", "adj", "Argument", "capable of being supported with good reasons"],
    ["Fallacious", "adj", "Argument", "based on faulty reasoning"],
    ["Groundless", "adj", "Argument", "lacking a sound basis or evidence"],
    ["Inconclusive", "adj", "Argument", "not sufficient to settle an issue"],
    ["Irrefutable", "adj", "Argument", "impossible to disprove convincingly"],
    ["Specious", "adj", "Argument", "appearing convincing but actually false or misleading"],
    ["Unsubstantiated", "adj", "Argument", "not supported by sufficient evidence"],
    ["Consistent", "adj", "Argument", "remaining compatible without contradiction"],
    ["Contradictory", "adj", "Argument", "containing ideas that cannot all be true together"],
    ["Dubious", "adj", "Argument", "unlikely to be true or reliable"],
    ["Implicit", "adj", "Argument", "suggested without being directly stated"],
    ["Subjective", "adj", "Argument", "based mainly on personal interpretation or feeling"],
    ["Cogent", "adj", "Argument", "clear, logical, and convincing"],
    ["Compelling", "adj", "Argument", "strong enough to demand serious attention"],
    ["Contentious", "adj", "Argument", "likely to cause disagreement"],
    ["Definitive", "adj", "Argument", "serving as a final or conclusive statement"],
    ["Disputable", "adj", "Argument", "open to reasonable disagreement"],
    ["Nuanced", "adj", "Argument", "showing careful distinctions rather than simple extremes"],
    ["Partisan", "adj", "Argument", "strongly favoring one side of a dispute"],
    ["Probable", "adj", "Argument", "likely to be true or occur"],
    ["Sound", "adj", "Argument", "well-supported and logically valid"],
    ["Tenable", "adj", "Argument", "able to be defended reasonably"],
    ["Unbiased", "adj", "Argument", "free from favoritism or prejudice"],
    ["Uncertain", "adj", "Argument", "not known or established with confidence"],
    ["Unsupported", "adj", "Argument", "lacking adequate evidence"],
    ["Allegation", "noun", "Argument", "a claim that someone has done something, not yet established as fact"],
    ["Analogy", "noun", "Argument", "a comparison used to clarify or support an idea"],
    ["Attribution", "noun", "Argument", "the act of identifying a source or cause"],
    ["Consistency", "noun", "Argument", "agreement among statements, actions, or findings"],
    ["Context", "noun", "Argument", "surrounding information that helps determine meaning"],
    ["Contingency", "noun", "Argument", "a possible future event that may affect an outcome"],
    ["Discrepancy", "noun", "Argument", "a difference that suggests two pieces of information do not agree"],
    ["Evidence", "noun", "Argument", "information used to support or evaluate a claim"],
    ["Qualifier", "noun", "Argument", "a word or phrase that limits the force of a statement"],
    ["Aloof", "adj", "Tone", "emotionally distant or reserved"],
    ["Amused", "adj", "Tone", "finding something entertaining or enjoyable"],
    ["Apathetic", "adj", "Tone", "showing little interest or concern"],
    ["Arrogant", "adj", "Tone", "overly confident and self-important"],
    ["Acerbic", "adj", "Tone", "sharp and biting in manner or expression"],
    ["Amiable", "adj", "Tone", "friendly and pleasant"],
    ["Anxious", "adj", "Tone", "worried or uneasy"],
    ["Apprehensive", "adj", "Tone", "uneasy about something that may happen"],
    ["Assertive", "adj", "Tone", "confident and direct without being passive"],
    ["Benevolent", "adj", "Tone", "well-meaning and inclined to do good"],
    ["Caustic", "adj", "Tone", "cutting or sarcastically critical"],
    ["Cautious", "adj", "Tone", "careful to avoid risk or error"],
    ["Candid", "adj", "Tone", "truthful and straightforward"],
    ["Compassionate", "adj", "Tone", "showing concern for others' difficulties"],
    ["Condescending", "adj", "Tone", "showing an attitude of superiority toward others"],
    ["Conciliatory", "adj", "Tone", "intended to calm disagreement and restore cooperation"],
    ["Contemplative", "adj", "Tone", "thoughtful and reflective"],
    ["Critical", "adj", "Tone", "inclined to evaluate flaws or shortcomings"],
    ["Cynical", "adj", "Tone", "distrustful of people's motives or sincerity"],
    ["Detached", "adj", "Tone", "emotionally removed and objective"],
    ["Didactic", "adj", "Tone", "intended to teach, sometimes in an overly instructive way"],
    ["Diplomatic", "adj", "Tone", "careful and tactful in dealing with disagreement"],
    ["Disdainful", "adj", "Tone", "showing strong lack of respect"],
    ["Earnest", "adj", "Tone", "serious and sincere"],
    ["Eloquent", "adj", "Tone", "fluent or persuasive in expression"],
    ["Empathetic", "adj", "Tone", "showing understanding of another person's feelings"],
    ["Enthusiastic", "adj", "Tone", "showing strong interest or excitement"],
    ["Facetious", "adj", "Tone", "treating a serious issue with inappropriate humor"],
    ["Flippant", "adj", "Tone", "not showing appropriate seriousness"],
    ["Formal", "adj", "Tone", "serious, conventional, and restrained in style"],
    ["Genial", "adj", "Tone", "cheerful and friendly"],
    ["Gracious", "adj", "Tone", "polite, considerate, and generous in manner"],
    ["Grudging", "adj", "Tone", "given reluctantly rather than willingly"],
    ["Hopeful", "adj", "Tone", "expecting or emphasizing a positive outcome"],
    ["Indignant", "adj", "Tone", "angry because something seems unjust or offensive"],
    ["Ironic", "adj", "Tone", "expressing meaning through a contrast between appearance and intention"],
    ["Jovial", "adj", "Tone", "cheerful and good-humored"],
    ["Jubilant", "adj", "Tone", "showing great happiness or triumph"],
    ["Lamenting", "adj", "Tone", "expressing grief, regret, or sorrow"],
    ["Lighthearted", "adj", "Tone", "cheerful and not serious in mood"],
    ["Measured", "adj", "Tone", "careful, controlled, and deliberate"],
    ["Melancholic", "adj", "Tone", "marked by quiet sadness"],
    ["Mocking", "adj", "Tone", "making fun of someone or something"],
    ["Mournful", "adj", "Tone", "expressing sadness or grief"],
    ["Nostalgic", "adj", "Tone", "longing for an earlier time"],
    ["Optimistic", "adj", "Tone", "expecting favorable outcomes"],
    ["Pensive", "adj", "Tone", "deeply thoughtful and somewhat wistful"],
    ["Persuasive", "adj", "Tone", "convincing and effective at influencing beliefs"],
    ["Pessimistic", "adj", "Tone", "expecting unfavorable outcomes"],
    ["Poignant", "adj", "Tone", "deeply moving or emotionally affecting"],
    ["Reassuring", "adj", "Tone", "intended to reduce fear or uncertainty"],
    ["Reflective", "adj", "Tone", "thoughtful about past experiences or ideas"],
    ["Remorseful", "adj", "Tone", "showing regret for wrongdoing"],
    ["Reproachful", "adj", "Tone", "expressing disapproval or disappointment"],
    ["Resigned", "adj", "Tone", "accepting something unpleasant as unavoidable"],
    ["Reverent", "adj", "Tone", "showing deep respect"],
    ["Sardonic", "adj", "Tone", "grimly mocking or cynical"],
    ["Sarcastic", "adj", "Tone", "using cutting or ironic remarks to mock"],
    ["Satirical", "adj", "Tone", "using humor or irony to expose flaws"],
    ["Skeptical", "adj", "Tone", "inclined to doubt or question"],
    ["Solemn", "adj", "Tone", "serious, formal, or somber"],
    ["Sympathetic", "adj", "Tone", "showing concern or understanding"],
    ["Tactful", "adj", "Tone", "careful not to offend or upset"],
    ["Threatening", "adj", "Tone", "suggesting possible harm or danger"],
    ["Tranquil", "adj", "Tone", "calm and peaceful"],
    ["Undercurrent", "noun", "Tone", "a hidden or less obvious feeling or influence"],
    ["Unflinching", "adj", "Tone", "showing no hesitation or fear"],
    ["Urgent", "adj", "Tone", "requiring immediate attention"],
    ["Vindictive", "adj", "Tone", "wanting revenge or punishment"],
    ["Whimsical", "adj", "Tone", "playfully imaginative or unusual"],
    ["Withering", "adj", "Tone", "severely or scornfully critical"],
    ["Yearning", "noun", "Tone", "a strong feeling of longing"],
    ["Zealous", "adj", "Tone", "passionately devoted to a cause or belief"],
    ["Acrimonious", "adj", "Tone", "marked by bitter or hostile disagreement"],
    ["Affable", "adj", "Tone", "pleasant and easy to talk to"],
    ["Agitated", "adj", "Tone", "disturbed, restless, or upset"],
    ["Bemused", "adj", "Tone", "puzzled or mildly confused"],
    ["Blatant", "adj", "Tone", "very obvious and often offensively so"],
    ["Blunt", "adj", "Tone", "direct and lacking in tact or softness"],
    ["Callous", "adj", "Tone", "showing little concern for others' feelings"],
    ["Capricious", "adj", "Tone", "changing suddenly and unpredictably"],
    ["Cordial", "adj", "Tone", "warm and polite"],
    ["Cryptic", "adj", "Tone", "mysterious or difficult to understand"],
    ["Derisive", "adj", "Tone", "expressing ridicule or scorn"],
    ["Ecstatic", "adj", "Tone", "extremely joyful or delighted"],
    ["Gregarious", "adj", "Tone", "sociable and fond of company"],
    ["Haughty", "adj", "Tone", "proud and disdainful toward others"],
    ["Humorous", "adj", "Tone", "amusing or playful"],
    ["Incredulous", "adj", "Tone", "unwilling to believe something"],
    ["Introspective", "adj", "Tone", "focused on examining one's own thoughts"],
    ["Laconic", "adj", "Tone", "using very few words"],
    ["Laudatory", "adj", "Tone", "expressing strong praise"],
    ["Matter-of-fact", "adj", "Tone", "plain and unemotional in style"],
    ["Mellifluous", "adj", "Tone", "pleasantly smooth and musical in sound"],
    ["Morose", "adj", "Tone", "sullen and gloomy"],
    ["Neutral", "adj", "Tone", "not expressing a strong position or emotion"],
    ["Nonchalant", "adj", "Tone", "calm and unconcerned"],
    ["Outspoken", "adj", "Tone", "expressing opinions openly and directly"],
    ["Patronizing", "adj", "Tone", "speaking as though others are less capable"],
    ["Peevish", "adj", "Tone", "easily irritated or annoyed"],
    ["Playful", "adj", "Tone", "light, lively, and not serious"],
    ["Reminiscent", "adj", "Tone", "bringing a previous person, place, or time to mind"],
    ["Restrained", "adj", "Tone", "controlled and not overly emotional"],
    ["Righteous", "adj", "Tone", "strongly convinced of moral correctness"],
    ["Rueful", "adj", "Tone", "showing regret or mild sadness"],
    ["Scornful", "adj", "Tone", "showing contempt or disrespect"],
    ["Serene", "adj", "Tone", "calm and untroubled"],
    ["Solemnity", "noun", "Tone", "the quality of being serious and dignified"],
    ["Strident", "adj", "Tone", "harsh, forceful, and difficult to ignore"],
    ["Subdued", "adj", "Tone", "quiet, restrained, or less intense"],
    ["Upbeat", "adj", "Tone", "cheerful and optimistic"],
    ["Venerable", "adj", "Tone", "highly respected because of age or distinction"],
    ["Wistful", "adj", "Tone", "sadly thoughtful and full of longing"],
    ["Absorb", "verb", "Science", "to take in or assimilate a substance, energy, or information"],
    ["Adapt", "verb", "Science", "to change in response to new conditions"],
    ["Anomaly", "noun", "Science", "a result or feature that differs from what is expected"],
    ["Antibody", "noun", "Science", "a protein produced to recognize and help neutralize specific substances"],
    ["Anticipate", "verb", "Science", "to expect or predict before an event occurs"],
    ["Apparatus", "noun", "Science", "a set of equipment used for a scientific purpose"],
    ["Aqueous", "adj", "Science", "relating to or containing water"],
    ["Assimilate", "verb", "Science", "to absorb and incorporate into a larger system"],
    ["Atomize", "verb", "Science", "to break a substance into extremely small particles"],
    ["Biodegradable", "adj", "Science", "capable of being broken down naturally by organisms"],
    ["Biological", "adj", "Science", "relating to living organisms or life processes"],
    ["Cellular", "adj", "Science", "relating to cells or composed of cells"],
    ["Coalesce", "verb", "Science", "to combine into one mass or whole"],
    ["Cohort", "noun", "Science", "a group studied or observed over a period of time"],
    ["Condense", "verb", "Science", "to change from gas to liquid or become more compact"],
    ["Conserve", "verb", "Science", "to protect from loss or unnecessary use"],
    ["Contaminant", "noun", "Science", "a substance that makes something impure or unsafe"],
    ["Correlation", "noun", "Science", "a statistical relationship between changing quantities"],
    ["Decay", "verb", "Science", "to break down or deteriorate over time"],
    ["Deficiency", "noun", "Science", "a lack of something necessary for normal function"],
    ["Densify", "verb", "Science", "to make or become more dense"],
    ["Derive", "verb", "Science", "to obtain something from a source or process"],
    ["Detect", "verb", "Science", "to discover the presence of something"],
    ["Deteriorate", "verb", "Science", "to become progressively worse"],
    ["Diffuse", "verb", "Science", "to spread widely through a space or substance"],
    ["Dilute", "verb", "Science", "to reduce concentration by adding another substance"],
    ["Diminish", "verb", "Science", "to become or make less"],
    ["Dissipate", "verb", "Science", "to spread out and gradually disappear or lose energy"],
    ["Dormant", "adj", "Science", "inactive but capable of becoming active later"],
    ["Ecosystem", "noun", "Science", "a community of organisms interacting with their environment"],
    ["Efficient", "adj", "Science", "achieving a result with minimal wasted resources"],
    ["Elastic", "adj", "Science", "able to return to original shape after deformation"],
    ["Endemic", "adj", "Science", "regularly found in a particular region or population"],
    ["Equilibrium", "noun", "Science", "a state in which opposing processes are balanced"],
    ["Erode", "verb", "Science", "to gradually wear away through physical or chemical action"],
    ["Evaporate", "verb", "Science", "to change from liquid to vapor"],
    ["Excrete", "verb", "Science", "to remove waste from an organism"],
    ["Fertile", "adj", "Science", "capable of producing abundant plant growth or offspring"],
    ["Fossilize", "verb", "Science", "to become preserved as a fossil"],
    ["Fracture", "verb", "Science", "to break or cause to break"],
    ["Genetic", "adj", "Science", "relating to genes or heredity"],
    ["Germinate", "verb", "Science", "to begin growing from a seed or spore"],
    ["Gradual", "adj", "Science", "happening slowly through small changes"],
    ["Habitat", "noun", "Science", "the natural environment where an organism lives"],
    ["Homogeneous", "adj", "Science", "composed of similar parts or substances"],
    ["Hypothesis", "noun", "Science", "a testable proposed explanation for an observation"],
    ["Immunity", "noun", "Science", "protection against a particular disease or pathogen"],
    ["Isolate", "verb", "Science", "to separate something from surrounding material or influences"],
    ["Kinetic", "adj", "Science", "relating to motion or movement"],
    ["Labile", "adj", "Science", "readily altered or broken down under certain conditions"],
    ["Longitudinal", "adj", "Science", "following the same subjects over time"],
    ["Magnify", "verb", "Science", "to make something appear larger"],
    ["Metabolism", "noun", "Science", "the chemical processes that sustain life in an organism"],
    ["Microscopic", "adj", "Science", "too small to be seen without magnification"],
    ["Mutation", "noun", "Science", "a change in genetic material"],
    ["Neutralize", "verb", "Science", "to make a substance or force ineffective or chemically neutral"],
    ["Nutrient", "noun", "Science", "a substance needed for growth and normal function"],
    ["Observable", "adj", "Science", "able to be detected or measured"],
    ["Organic", "adj", "Science", "relating to living matter or carbon-based compounds"],
    ["Oscillate", "verb", "Science", "to move repeatedly back and forth"],
    ["Parameter", "noun", "Science", "a measurable factor that defines a system or sets its limits"],
    ["Pathogen", "noun", "Science", "an organism or agent capable of causing disease"],
    ["Permeable", "adj", "Science", "allowing liquids or gases to pass through"],
    ["Photosynthesis", "noun", "Science", "the process by which plants use light to make chemical energy"],
    ["Precipitate", "verb", "Science", "to cause a dissolved substance to form a solid"],
    ["Predator", "noun", "Science", "an organism that hunts and consumes another organism"],
    ["Prevalent", "adj", "Science", "common or widespread"],
    ["Proliferate", "verb", "Science", "to increase rapidly in number or amount"],
    ["Quantitative", "adj", "Science", "involving numerical measurement"],
    ["Qualitative", "adj", "Science", "describing qualities or characteristics rather than numbers"],
    ["Radiate", "verb", "Science", "to send out energy, light, or particles"],
    ["Reactant", "noun", "Science", "a starting substance in a chemical reaction"],
    ["Receptor", "noun", "Science", "a cell or molecule that receives and responds to a signal"],
    ["Replicate", "verb", "Science", "to reproduce or repeat with close similarity"],
    ["Sediment", "noun", "Science", "material that settles at the bottom of a liquid"],
    ["Secrete", "verb", "Science", "to produce and release a substance from a cell or gland"],
    ["Stabilize", "verb", "Science", "to make or become steady"],
    ["Substrate", "noun", "Science", "a surface or substance on which a process occurs"],
    ["Tectonic", "adj", "Science", "relating to the movement and structure of Earth's crust"],
    ["Thermal", "adj", "Science", "relating to heat"],
    ["Translucent", "adj", "Science", "allowing some light to pass through but not clear"],
    ["Turbulent", "adj", "Science", "characterized by chaotic, irregular movement"],
    ["Uptake", "noun", "Science", "the process of taking in a substance"],
    ["Variable", "noun", "Science", "a factor that can change in an experiment or system"],
    ["Vascular", "adj", "Science", "relating to vessels that transport fluids in an organism"],
    ["Vector", "noun", "Science", "a quantity with magnitude and direction, or an organism carrying a pathogen"],
    ["Viscous", "adj", "Science", "thick and resistant to flow"],
    ["Volatile", "adj", "Science", "likely to change rapidly or evaporate easily"],
    ["Absorbance", "noun", "Science", "the amount of radiation absorbed by a substance"],
    ["Acclimate", "verb", "Science", "to adjust to a new environmental condition"],
    ["Acidic", "adj", "Science", "having a relatively high concentration of hydrogen ions"],
    ["Aggregate", "verb", "Science", "to collect into a whole or group"],
    ["Alkaline", "adj", "Science", "having properties associated with a base rather than an acid"],
    ["Amplify", "verb", "Science", "to increase the strength or effect of a signal"],
    ["Arid", "adj", "Science", "very dry and receiving little precipitation"],
    ["Biodiversity", "noun", "Science", "the variety of living organisms in an ecosystem or region"],
    ["Biofuel", "noun", "Science", "fuel made from recently living biological material"],
    ["Biomass", "noun", "Science", "the total mass of living material in a given area or system"],
    ["Biosphere", "noun", "Science", "the global zone where life exists"],
    ["Buffer", "noun", "Science", "a substance or system that resists sudden changes in a condition"],
    ["Calibrate", "verb", "Science", "to adjust an instrument to ensure accurate measurement"],
    ["Capillary", "noun", "Science", "a very small blood vessel or narrow tube"],
    ["Chlorophyll", "noun", "Science", "the green pigment that helps plants capture light for photosynthesis"],
    ["Cohesion", "noun", "Science", "the tendency of particles to stick to one another"],
    ["Combustion", "noun", "Science", "a chemical reaction involving rapid oxidation and usually heat"],
    ["Compress", "verb", "Science", "to press or reduce into a smaller volume"],
    ["Conductivity", "noun", "Science", "the ability of a material to conduct heat or electricity"],
    ["Corrode", "verb", "Science", "to gradually destroy through chemical reaction"],
    ["Crystalline", "adj", "Science", "having a regular repeating molecular structure"],
    ["Decompose", "verb", "Science", "to break down into simpler substances"],
    ["Dehydrate", "verb", "Science", "to remove water from something"],
    ["Diffusion", "noun", "Science", "the movement of particles from higher to lower concentration"],
    ["Distill", "verb", "Science", "to purify or separate by controlled evaporation and condensation"],
    ["Electrolyte", "noun", "Science", "a substance that conducts electricity when dissolved or molten"],
    ["Emulsion", "noun", "Science", "a mixture of liquids that normally do not remain mixed"],
    ["Enzyme", "noun", "Science", "a biological catalyst that speeds a reaction"],
    ["Exothermic", "adj", "Science", "releasing heat during a process or reaction"],
    ["Filtration", "noun", "Science", "the separation of material by passing it through a filter"],
    ["Fission", "noun", "Science", "the splitting of an atomic nucleus"],
    ["Fusion", "noun", "Science", "the combining of atomic nuclei into a larger nucleus"],
    ["Gradient", "noun", "Science", "a change in a quantity over distance or time"],
    ["Gravitational", "adj", "Science", "relating to the force of attraction between masses"],
    ["Inertia", "noun", "Science", "the tendency of matter to resist changes in motion"],
    ["Insulate", "verb", "Science", "to reduce the transfer of heat, sound, or electricity"],
    ["Ionic", "adj", "Science", "relating to ions or compounds formed from charged particles"],
    ["Isotope", "noun", "Science", "a form of an element with the same proton number but different neutron number"],
    ["Magnitude", "noun", "Science", "the size or extent of a quantity"],
    ["Molecule", "noun", "Science", "a group of atoms held together by chemical bonds"],
    ["Oxidize", "verb", "Science", "to undergo a chemical process involving loss of electrons or combination with oxygen"],
    ["Polymer", "noun", "Science", "a large molecule made of repeated smaller units"],
    ["Pressure", "noun", "Science", "force exerted over a given area"],
    ["Proton", "noun", "Science", "a positively charged particle in an atomic nucleus"],
    ["Radiation", "noun", "Science", "energy transmitted through space or matter"],
    ["Solute", "noun", "Science", "a substance dissolved in a solvent"],
    ["Solvent", "noun", "Science", "a substance capable of dissolving another substance"],
    ["Spectral", "adj", "Science", "relating to a range of wavelengths or frequencies"],
    ["Spectrum", "noun", "Science", "a range of values or wavelengths arranged in order"],
    ["Stimulus", "noun", "Science", "a change that causes a response in an organism or system"],
    ["Strain", "noun", "Science", "deformation caused by an applied force"],
    ["Sublimate", "verb", "Science", "to change directly between solid and gas without becoming liquid"],
    ["Sustain", "verb", "Science", "to maintain a process or condition over time"],
    ["Synthetic", "adj", "Science", "made artificially rather than occurring naturally"],
    ["Thermodynamic", "adj", "Science", "relating to heat, energy, and their transformations"],
    ["Transpire", "verb", "Science", "to occur or become known; in plants, to release water vapor"],
    ["Ultraviolet", "adj", "Science", "relating to electromagnetic radiation beyond visible violet light"],
    ["Vaporize", "verb", "Science", "to convert into vapor"],
    ["Viscosity", "noun", "Science", "a fluid's resistance to flowing"]
];
const search=document.getElementById("vocab-search"),
category=document.getElementById("vocab-category"),
statusFilter=document.getElementById("vocab-status"),
wordEl=document.getElementById("vocab-word"),
pronEl=document.getElementById("vocab-pronunciation"),
catEl=document.getElementById("vocab-category-label"),
statusEl=document.getElementById("vocab-status-label"),
posEl=document.getElementById("vocab-position"),
meaningEl=document.getElementById("vocab-meaning"),
exampleEl=document.getElementById("vocab-example"),
definition=document.getElementById("vocab-definition"),
reveal=document.getElementById("reveal-button"),
reviewButton=document.getElementById("review-button"),
actions=document.getElementById("vocab-actions"),
prev=document.getElementById("previous-button"),
next=document.getElementById("next-button"),
empty=document.getElementById("vocab-empty"),
card=document.getElementById("vocab-card"),
progressText=document.getElementById("vocab-progress-text"),
progressBar=document.getElementById("vocab-progress-bar"),
countEl=document.getElementById("vocab-count"),
statusSummary=document.getElementById("vocab-status-summary");

const STATE_KEY="absoluteprep_vocab_state";
const legacyLearned=JSON.parse(localStorage.getItem("absoluteprep_vocab_learned")||"{}");
let studyState=JSON.parse(localStorage.getItem(STATE_KEY)||"null");

if(!studyState||typeof studyState!=="object"){
    studyState={solved:{},review:{}};
}
studyState.solved=studyState.solved&&typeof studyState.solved==="object"?studyState.solved:{};
studyState.review=studyState.review&&typeof studyState.review==="object"?studyState.review:{};

Object.keys(legacyLearned).forEach(word=>{
    if(legacyLearned[word]===true){
        studyState.solved[word]=true;
    }
});
localStorage.setItem(STATE_KEY,JSON.stringify(studyState));

function saveState(){
    localStorage.setItem(STATE_KEY,JSON.stringify(studyState));
}

function shuffle(items){
    const result=[...items];
    for(let i=result.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [result[i],result[j]]=[result[j],result[i]];
    }
    return result;
}

function solvedCount(){
    return words.reduce((total,word)=>total+(studyState.solved[word[0]]===true?1:0),0);
}

function reviewCount(){
    return words.reduce((total,word)=>total+(studyState.review[word[0]]===true?1:0),0);
}

function updateProgress(){
    const done=solvedCount();
    progressText.textContent=done+" of "+words.length+" solved";
    progressBar.style.width=(done/words.length*100)+"%";
    statusSummary.textContent=reviewCount()+" review · "+(words.length-done)+" unsolved";
}

function updateStatusUI(word){
    const isSolved=studyState.solved[word[0]]===true;
    const isReview=studyState.review[word[0]]===true;

    statusEl.textContent=isReview?"Review":isSolved?"Solved":"Unsolved";
    statusEl.className="vocab-status-chip "+(isReview?"review":isSolved?"solved":"unsolved");

    reviewButton.textContent=isReview?"★ Remove Review":"☆ Mark for Review";
    reviewButton.classList.toggle("active",isReview);
}

function render(){
    if(!filtered.length){
        card.classList.add("hidden");
        empty.classList.remove("hidden");
        countEl.textContent="0 words";
        updateProgress();
        return;
    }

    card.classList.remove("hidden");
    empty.classList.add("hidden");

    const w=filtered[index];
    wordEl.textContent=w[0];
    pronEl.textContent="";
    pronEl.classList.add("hidden");
    catEl.textContent=w[2];
    posEl.textContent=(index+1)+" / "+filtered.length;
    meaningEl.textContent=w[3];
    exampleEl.textContent=exampleFor(w[0],w[1],w[2]);

    definition.classList.add("hidden");
    actions.classList.add("hidden");
    reveal.classList.remove("hidden");

    updateStatusUI(w);

    prev.disabled=index===0;
    next.disabled=index===filtered.length-1;
    countEl.textContent=filtered.length+" words";
    updateProgress();
}

function applyFilters(){
    const q=search.value.trim().toLowerCase();
    const c=category.value;
    const s=statusFilter.value;

    let nextWords=words.filter(w=>
        (!q||w[0].toLowerCase().includes(q)||w[3].toLowerCase().includes(q))&&
        (c==="all"||w[2]===c)
    );

    if(s==="review"){
        nextWords=nextWords.filter(w=>studyState.review[w[0]]===true);
    }else if(s==="unsolved"){
        nextWords=nextWords.filter(w=>studyState.solved[w[0]]!==true);
    }else if(s==="solved"){
        nextWords=nextWords.filter(w=>studyState.solved[w[0]]===true);
    }

    filtered=shuffle(nextWords);
    index=0;
    render();
}

reveal.addEventListener("click",()=>{
    definition.classList.remove("hidden");
    actions.classList.remove("hidden");
    reveal.classList.add("hidden");
});

reviewButton.addEventListener("click",()=>{
    if(!filtered.length) return;
    const word=filtered[index][0];
    studyState.review[word]=studyState.review[word]!==true;
    saveState();
    updateStatusUI(filtered[index]);
    updateProgress();
});

document.getElementById("known-button").addEventListener("click",()=>{
    const word=filtered[index][0];
    studyState.solved[word]=true;
    saveState();
    updateProgress();
    if(index<filtered.length-1){
        index++;
        render();
    }else{
        applyFilters();
    }
});

document.getElementById("learning-button").addEventListener("click",()=>{
    const word=filtered[index][0];
    studyState.solved[word]=false;
    saveState();
    updateProgress();
    if(index<filtered.length-1){
        index++;
        render();
    }else{
        applyFilters();
    }
});

prev.addEventListener("click",()=>{
    if(index>0){
        index--;
        render();
    }
});

next.addEventListener("click",()=>{
    if(index<filtered.length-1){
        index++;
        render();
    }
});

search.addEventListener("input",applyFilters);
category.addEventListener("change",applyFilters);
statusFilter.addEventListener("change",applyFilters);

let filtered=shuffle([...words]);
let index=0;
render();