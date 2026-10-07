import json
from pathlib import Path

BANK = Path("math-question-bank.json")
SOURCE_BATCH = "2026-10-07-deduplicated-batch45"
CLASSIFICATION_VERSION = "2026-10-08-v2"

def base(n, domain, skill, difficulty, question, explanation, **extra):
    qid = f"math-20261007-dedup45-q{n:03d}"
    item = {
        "id": qid,
        "groupId": qid,
        "status": "staged",
        "section": "Math",
        "domain": domain,
        "skill": skill,
        "difficulty": difficulty,
        "passage": "",
        "question": question,
        "explanation": explanation,
        "sourceBatch": SOURCE_BATCH,
        "sourceQuestionNumber": n,
        "subtopic": skill,
        "classificationVersion": CLASSIFICATION_VERSION,
    }
    item.update(extra)
    return item

def mc(n, domain, skill, difficulty, question, choices, correct, explanation, **extra):
    return base(
        n, domain, skill, difficulty, question, explanation,
        choices=choices,
        correctAnswer=correct,
        answerType="multiple-choice",
        **extra
    )

def sr(n, domain, skill, difficulty, question, answers, explanation, **extra):
    vals = answers if isinstance(answers, list) else [answers]
    return base(
        n, domain, skill, difficulty, question, explanation,
        choices={},
        correctAnswer=vals[0],
        answerType="student-response",
        acceptedAnswers=vals,
        **extra
    )

new_questions = [
    sr(
        24, "Algebra", "Linear Functions", "Medium",
        r"The function \(f\) is defined by \(f(x)=4(2x-1)+3\). For what value of \(x\) does \(f(x)=35\)?",
        "4.5",
        r"Set the function equal to 35: \(4(2x-1)+3=35\). This simplifies to \(8x-1=35\), so \(8x=36\) and \(\boxed{x=4.5}\).",
    ),
    mc(
        25, "Algebra", "Linear Inequalities", "Medium",
        r"A workshop must use strictly less than 90 kilowatt-hours of electricity during a certain period. Lighting and other fixed equipment use 12 kilowatt-hours. Machine A uses 4 kilowatt-hours per hour, and machine B uses 6 kilowatt-hours per hour. If machine A operates for \(x\) hours and machine B operates for \(y\) hours, which inequality represents the possible values of \(x\) and \(y\)?",
        {"A": r"\(4x+6y\le78\)", "B": r"\(4x+6y<90\)", "C": r"\(6x+4y<78\)", "D": r"\(4x+6y<78\)"},
        "D",
        r"The total electricity use is \(4x+6y+12\). Because the workshop must use strictly less than 90 kilowatt-hours, \(4x+6y+12<90\), so \(\boxed{4x+6y<78}\).",
    ),
    sr(
        26, "Algebra", "Systems of Linear Equations", "Medium",
        r"The solution to the system \[y=3-2x\] \[4x-3y=31\] is \((x,y)\). What is the value of \(x\)?",
        "4",
        r"Substitute \(y=3-2x\) into the second equation: \(4x-3(3-2x)=31\). Then \(10x-9=31\), so \(10x=40\) and \(\boxed{x=4}\).",
    ),
    mc(
        28, "Algebra", "Systems of Linear Equations", "Medium",
        r"What is the solution to the system? \[2x+y=17\] \[x-2y=-4\]",
        {"A": r"\((5,6)\)", "B": r"\((6,5)\)", "C": r"\((7,3)\)", "D": r"\((4,9)\)"},
        "B",
        r"From the first equation, \(y=17-2x\). Substitute into the second: \(x-2(17-2x)=-4\), so \(5x=30\) and \(x=6\). Then \(y=5\), giving \(\boxed{(6,5)}\).",
        desmosMethod=r"Graph \(2x+y=17\) and \(x-2y=-4\). The lines intersect at \((6,5)\).",
    ),
    mc(
        29, "Algebra", "Linear Inequalities", "Hard",
        r"Which point is a solution to the system of inequalities? \[2y>x-6\] \[3x+y\le12\]",
        {"A": r"\((4,1)\)", "B": r"\((0,-3)\)", "C": r"\((6,0)\)", "D": r"\((2,3)\)"},
        "D",
        r"For \((2,3)\), the first inequality gives \(6>-4\), and the second gives \(9\le12\). Both are true, so \(\boxed{(2,3)}\) is a solution.",
        desmosMethod=r"Graph \(2y>x-6\) and \(3x+y\le12\). Of the four choices, only \((2,3)\) lies in the overlap.",
    ),
    mc(
        30, "Algebra", "Systems of Linear Equations", "Medium",
        r"At how many points do the graphs of the equations \[6x-9y=12\] and \[4x-6y=11\] intersect in the \(xy\)-plane?",
        {"A": "Exactly one", "B": "Infinitely many", "C": "Zero", "D": "Exactly two"},
        "C",
        r"The x- and y-coefficients of the second equation are \(\frac23\) of those in the first, but \(11\ne\frac23(12)=8\). The equations therefore represent distinct parallel lines, so they intersect at \(\boxed{0}\) points.",
        desmosMethod="Graph both equations. The lines are parallel and do not intersect.",
    ),
    mc(
        31, "Algebra", "Linear Equations", "Hard",
        r"Which table gives three values of \(x\) and the corresponding values of \(y\) that satisfy \[\frac35x-\frac47y=6?\]",
        {"A": "", "B": "", "C": "", "D": ""},
        "B",
        r"Multiplying the equation by 35 gives \(21x-20y=210\). For \(x=5,10,15\), the corresponding y-values are \(-\frac{21}{4},0,\frac{21}{4}\), respectively. These values appear in choice B.",
        choiceTables={
            "A": {"headers": ["x", "y"], "rows": [["5", "21/4"], ["10", "0"], ["15", "-21/4"]]},
            "B": {"headers": ["x", "y"], "rows": [["5", "-21/4"], ["10", "0"], ["15", "21/4"]]},
            "C": {"headers": ["x", "y"], "rows": [["5", "-35/4"], ["10", "0"], ["15", "35/4"]]},
            "D": {"headers": ["x", "y"], "rows": [["5", "-21/4"], ["10", "6"], ["15", "21/4"]]},
        },
    ),
    mc(
        32, "Problem-Solving & Data Analysis", "Ratio, Rates, Percentages", "Hard",
        r"A service normally charges a one-time setup fee of $40 plus $25 per month. Under a promotion, the customer's entire pre-discount charge is reduced by 20%. If \(C\) is the amount paid for \(m\) months, which equation defines \(C\)?",
        {"A": r"\(C=25m+32\)", "B": r"\(C=20m+40\)", "C": r"\(C=32m+20\)", "D": r"\(C=20m+32\)"},
        "D",
        r"The pre-discount charge is \(25m+40\). A 20% reduction means the customer pays 80% of that amount: \(C=0.8(25m+40)=\boxed{20m+32}\).",
    ),
    mc(
        33, "Problem-Solving & Data Analysis", "Ratio, Rates, Percentages", "Medium",
        "At the surface of the water, the pressure on a diver is 15.2 pounds per square inch. For each foot below the surface, the pressure increases by 0.43 pound per square inch. A diver descends 70 feet and then ascends 18 feet. What is the pressure, in pounds per square inch, at the diver's final depth?",
        {"A": "37.56", "B": "45.30", "C": "22.36", "D": "52.00"},
        "A",
        r"The final depth is \(70-18=52\) feet. The pressure is therefore \(15.2+0.43(52)=15.2+22.36=\boxed{37.56}\) pounds per square inch.",
    ),
    mc(
        34, "Algebra", "Linear Inequalities", "Hard",
        r"An elevator has a posted maximum load of 3,000 pounds, but building rules permit it to carry at most 90% of that amount. An operator weighing 180 pounds and a 120-pound cart are already inside. Each small box weighs 35 pounds, and each large box weighs 50 pounds. If \(x\) small boxes and \(y\) large boxes are loaded, which inequality represents the possible combinations of boxes?",
        {"A": r"\(35x+50y\le2700\)", "B": r"\(35x+50y\le2400\)", "C": r"\(35x+50y+300\le3000\)", "D": r"\(35x+50y<2400\)"},
        "B",
        r"The permitted load is \(0.90(3000)=2700\) pounds. The operator and cart use \(180+120=300\) pounds, leaving 2400 pounds for boxes. Thus, \(\boxed{35x+50y\le2400}\).",
    ),
    mc(
        35, "Algebra", "Linear Functions", "Medium",
        r"The function \(f\) is defined by \(f(x)=5(2x-7)-3x\). What is the x-intercept of the graph of \(y=f(x)\)?",
        {"A": r"\((0,5)\)", "B": r"\((-5,0)\)", "C": r"\((7,0)\)", "D": r"\((5,0)\)"},
        "D",
        r"At the x-intercept, \(f(x)=0\). Thus \(5(2x-7)-3x=0\), which simplifies to \(7x-35=0\). Therefore, \(x=5\), so the intercept is \(\boxed{(5,0)}\).",
    ),
    sr(
        36, "Algebra", "Linear Functions", "Hard",
        r"The table shows three values of \(x\) and their corresponding values of a linear function \(f\). The function is defined by \[f(x)=m(2x-5)-7,\] where \(m\) is a constant. What is the value of \(m\)?",
        "6",
        r"Using \(x=6\) and \(f(6)=35\), \(35=m(12-5)-7=7m-7\). Thus \(42=7m\), so \(\boxed{m=6}\).",
        table={"caption": "Values of a linear function f", "headers": ["x", "f(x)"], "rows": [["4", "11"], ["6", "35"], ["8", "59"]]},
    ),
    mc(
        37, "Algebra", "Linear Inequalities", "Easy",
        r"A pilot certification requires at least 120 hours of flight time. A trainee has already logged 73 hours and has 18 additional hours scheduled. What is the minimum number of additional unscheduled flight hours the trainee must complete to meet the requirement?",
        {"A": "29", "B": "47", "C": "102", "D": "120"},
        "A",
        r"After the scheduled hours, the trainee will have \(73+18=91\) hours. If \(h\) is the additional amount needed, then \(91+h\ge120\), so \(h\ge29\). The minimum is \(\boxed{29}\).",
    ),
    mc(
        38, "Algebra", "Linear Functions", "Hard",
        r"The graph shown is the graph of \(y=f(x)-12\), where \(f\) is linear. The line passes through \((-2,0)\) and \((0,-4)\). Which equation defines \(f\)?",
        {"A": r"\(f(x)=-2x-16\)", "B": r"\(f(x)=2x+8\)", "C": r"\(f(x)=-2x+8\)", "D": r"\(f(x)=2x-16\)"},
        "C",
        r"The graphed line has slope \(\frac{-4-0}{0-(-2)}=-2\) and y-intercept \(-4\). Thus \(f(x)-12=-2x-4\). Adding 12 gives \(\boxed{f(x)=-2x+8}\).",
        graph={
            "type": "xy", "caption": "Graph of y = f(x) − 12",
            "xMin": -3, "xMax": 1, "yMin": -6, "yMax": 2, "xStep": 1, "yStep": 1,
            "xLabel": "x", "yLabel": "y",
            "series": [{"points": [[-3, 2], [-2, 0], [0, -4], [1, -6]], "showPoints": True, "labelPoints": False}],
        },
    ),
    mc(
        39, "Algebra", "Systems of Linear Equations", "Easy",
        r"The solution to the system \[4u=3v\] \[5u=-2v\] is \((u,v)\). What is the value of \(u\)?",
        {"A": "-5", "B": "-2", "C": "0", "D": "3"},
        "C",
        r"The equations give \(u=\frac34v\) and \(u=-\frac25v\). These can both be true only when \(v=0\), so \(\boxed{u=0}\).",
    ),
    mc(
        40, "Algebra", "Linear Inequalities", "Hard",
        r"A salesperson earns a base salary of \(b\) dollars. If annual sales are \(s\) dollars, where \(s\ge2b\), the salesperson also earns a commission equal to 12% of the amount by which \(s\) exceeds \(2b\). The salesperson wants total earnings to be at least \(1.6b\) and at most \(2.2b\). Which inequality gives all possible values of \(s\)?",
        {"A": r"\(5b\le s\le10b\)", "B": r"\(7b\le s\le12b\)", "C": r"\(0.6b\le s\le1.2b\)", "D": r"\(9b\le s\le14b\)"},
        "B",
        r"Total earnings are \(b+0.12(s-2b)\). Therefore, \(1.6b\le b+0.12(s-2b)\le2.2b\). Simplifying gives \(0.84b\le0.12s\le1.44b\), and dividing by 0.12 yields \(\boxed{7b\le s\le12b}\).",
    ),
    mc(
        41, "Algebra", "Linear Functions", "Hard",
        r"For the linear function \(f\), the table shows three values of \(x\) and \(f(x)\). If \(h(x)=f(x)-23\), which equation defines \(h\)?",
        {"A": r"\(h(x)=-4x+34\)", "B": r"\(h(x)=4x-12\)", "C": r"\(h(x)=-4x-12\)", "D": r"\(h(x)=-4x+11\)"},
        "C",
        r"Using \((-5,31)\) and \((1,7)\), the slope of \(f\) is \(-4\). Since \(f(1)=7\), \(f(x)=-4x+11\). Therefore, \(h(x)=f(x)-23=\boxed{-4x-12}\).",
        table={"caption": "Values of the linear function f", "headers": ["x", "f(x)"], "rows": [["-5", "31"], ["1", "7"], ["4", "-5"]]},
    ),
    mc(
        42, "Algebra", "Linear Functions", "Medium",
        r"What is the slope of the graph of \[3(2x-y)+4y=18\] in the \(xy\)-plane?",
        {"A": "-6", "B": r"\(-\frac16\)", "C": r"\(\frac16\)", "D": "6"},
        "A",
        r"Expand and combine like terms: \(6x-3y+4y=18\), so \(6x+y=18\). Solving for \(y\) gives \(y=-6x+18\), so the slope is \(\boxed{-6}\).",
    ),
    mc(
        43, "Algebra", "Systems of Linear Equations", "Hard",
        r"A bus travels part of a trip on a highway at an average speed of 70 miles per hour and the rest on local roads at an average speed of 45 miles per hour. The bus travels 345 miles total. The entire trip takes 6 hours, including a 30-minute stop during which the bus does not move. If \(x\) is the number of hours spent driving on the highway and \(y\) is the number of hours spent driving on local roads, which system represents the situation?",
        {
            "A": r"\(\begin{cases}70x+45y=345\\x+y=6\end{cases}\)",
            "B": r"\(\begin{cases}70x+45y=345\\x+y=5.5\end{cases}\)",
            "C": r"\(\begin{cases}x+y=345\\70x+45y=5.5\end{cases}\)",
            "D": r"\(\begin{cases}70x+45y=6\\x+y=345\end{cases}\)",
        },
        "B",
        r"The distance equation is \(70x+45y=345\). Since 30 minutes is 0.5 hour, the actual driving time is \(6-0.5=5.5\) hours, so \(x+y=5.5\). Thus choice B is correct.",
    ),
    mc(
        44, "Algebra", "Linear Functions", "Easy",
        r"For a linear function \(f\), the graph passes through the y-axis at \((0,7)\). Whenever \(x\) increases by 4 units, the value of \(f(x)\) decreases by 6 units. Which equation defines \(f\)?",
        {"A": r"\(f(x)=\frac32x+7\)", "B": r"\(f(x)=-\frac23x+7\)", "C": r"\(f(x)=-\frac32x-7\)", "D": r"\(f(x)=-\frac32x+7\)"},
        "D",
        r"The slope is \(\frac{-6}{4}=-\frac32\), and the y-intercept is 7. Therefore, \(\boxed{f(x)=-\frac32x+7}\).",
    ),
    mc(
        45, "Algebra", "Linear Inequalities", "Easy",
        "A hiker's daily goal is to travel at least 32 kilometers. The hiker has already traveled 7 kilometers and plans to continue at an average speed of 5 kilometers per hour. What is the minimum number of additional hours the hiker must travel to meet the goal?",
        {"A": "4", "B": "5", "C": "6.4", "D": "8"},
        "B",
        r"If \(h\) is the additional time, then \(7+5h\ge32\). Thus \(5h\ge25\), so \(h\ge5\). The minimum is \(\boxed{5}\) hours.",
    ),
]

data = json.loads(BANK.read_text(encoding="utf-8"))
existing = {q["id"] for q in data.get("questions", [])}
added = [q for q in new_questions if q["id"] not in existing]
data.setdefault("questions", []).extend(added)
data["generatedAt"] = "2026-10-08"

audit = data.setdefault("audit", {})
audit["deduplicatedBatch20261007"] = {
    "sourceQuestions": 45,
    "retained": 42,
    "excluded": [
        {"sourceQuestionNumber": 10, "reason": "Close reskin of existing parallel-line equation question math-20261006-batch465-q001."},
        {"sourceQuestionNumber": 23, "reason": "Structural duplicate of existing solve-linear-then-evaluate questions, including math-20261006-batch465-q106."},
        {"sourceQuestionNumber": 27, "reason": "Structural duplicate of existing graph-reading question math-20261006-batch465-q287."},
    ],
    "repairedSourceFormatting": {
        "inequalitySymbols": [2, 6, 8, 25, 29, 34, 37, 40, 45],
        "recoveredFractions": [20, 31],
        "notes": [
            "Recovered q20 as 7x/12=21 and 6/x from the supplied classical solution.",
            "Recovered q31 as (3/5)x-(4/7)y=6 from the supplied answer table and solution logic.",
            "Rebuilt duplicated-looking inequality choices where comparison symbols were lost in the paste.",
        ],
    },
    "visuals": {
        "graphs": [16, 18, 38],
        "diagrams": [22],
        "tables": [36, 41],
        "choiceTables": [13, 31],
    },
    "difficultyCalibration": {
        "approach": "Relative within each affected subtopic while preserving the existing bank's near-even Easy/Medium/Hard distribution.",
        "addedBySubtopic": {
            "Linear Equations": {"Easy": 3, "Medium": 4, "Hard": 2},
            "Linear Functions": {"Easy": 3, "Medium": 4, "Hard": 3},
            "Systems of Linear Equations": {"Easy": 3, "Medium": 4, "Hard": 2},
            "Linear Inequalities": {"Easy": 4, "Medium": 3, "Hard": 3},
            "Ratio, Rates, Percentages": {"Easy": 1, "Medium": 1, "Hard": 1},
            "Lines, Angles, and Triangles": {"Easy": 0, "Medium": 1, "Hard": 0},
        },
    },
}

BANK.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Added {len(added)} remaining audited questions; total now {len(data['questions'])}.")
