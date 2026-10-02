const formulas=[
{id:"slope-intercept",formula:"y=mx+b",topic:"Slope-intercept form",category:"Algebra",meaning:"A linear equation where m is the slope (rate of change) and b is the y-intercept (the value of y when x=0).",symbols:"m = slope; b = y-intercept; x = input; y = output.",example:"If \\(y=3x+5\\), then \\(m=3\\): y increases by 3 whenever x increases by 1. The y-intercept is 5.",note:"On the SAT, coefficients and constants often have contextual meanings. Always attach units to the slope when the problem gives a real-world situation."},
{id:"slope-two-points",formula:"m=\\frac{y_2-y_1}{x_2-x_1}",topic:"Slope from two points",category:"Algebra",meaning:"Slope is the change in y divided by the change in x between two points on a nonvertical line.",symbols:"\\((x_1,y_1)\\), \\((x_2,y_2)\\) = points on the line; m = slope.",example:"Through \\((2,5)\\) and \\((6,13)\\), \\(m=\\frac{13-5}{6-2}=2\\).",note:"Keep the subtraction order consistent in numerator and denominator. A vertical line has undefined slope."},
{id:"point-slope",formula:"y-y_1=m(x-x_1)",topic:"Point-slope form",category:"Algebra",meaning:"A line with slope m passing through the point \\((x_1,y_1)\\).",symbols:"m = slope; \\((x_1,y_1)\\) = known point.",example:"Slope 4 through \\((2,3)\\): \\(y-3=4(x-2)\\).",note:"This is often the fastest form when the SAT gives one point and a slope."},
{id:"standard-linear",formula:"Ax+By=C",topic:"Standard form of a line",category:"Algebra",meaning:"A common linear-equation form. When \\(B\\ne0\\), its slope is \\(-A/B\\).",symbols:"A and B = coefficients; C = constant.",example:"For \\(2x+3y=12\\), \\(y=-\\frac23x+4\\), so the slope is \\(-\\frac23\\).",note:"To find an x-intercept set y=0; to find a y-intercept set x=0."},
{id:"linear-solve",formula:"ax+b=c\\;\\Rightarrow\\;x=\\frac{c-b}{a}",topic:"Linear equation in one variable",category:"Algebra",meaning:"Isolate x by undoing addition/subtraction first and multiplication/division second.",symbols:"a = nonzero coefficient of x; b,c = constants.",example:"\\(3x+5=20\\Rightarrow x=5\\).",note:"If the variable terms cancel, check whether the remaining statement is always true (infinitely many solutions) or false (no solution)."},
{id:"direct-variation",formula:"y=kx",topic:"Direct variation",category:"Algebra",meaning:"y is directly proportional to x; k is the constant of proportionality and equals \\(y/x\\).",symbols:"k = constant of proportionality.",example:"If 4 notebooks cost $10, \\(k=10/4=2.5\\) dollars per notebook, so \\(C=2.5n\\).",note:"A direct-variation graph passes through the origin."},
{id:"linear-model",formula:"\\text{output}=\\text{initial value}+(\\text{rate})(\\text{input})",topic:"Linear modeling",category:"Algebra",meaning:"Many SAT word problems use a fixed starting amount plus a constant rate of change.",symbols:"initial value = intercept; rate = slope.",example:"A taxi charges $4 plus $2.50 per mile: \\(C=4+2.5m\\).",note:"Translate the units before calculating. The rate's units are output units per input unit."},
{id:"x-intercept",formula:"y=0",topic:"Finding an x-intercept",category:"Algebra",meaning:"At an x-intercept, the graph lies on the x-axis, so the y-coordinate is 0.",symbols:"Set y=0 and solve for x.",example:"For \\(y=2x-8\\), \\(0=2x-8\\Rightarrow x=4\\), so the intercept is \\((4,0)\\).",note:"The SAT may ask for the x-coordinate only, not the full ordered pair."},
{id:"y-intercept",formula:"x=0",topic:"Finding a y-intercept",category:"Algebra",meaning:"At a y-intercept, the graph lies on the y-axis, so the x-coordinate is 0.",symbols:"Set x=0 and solve for y.",example:"For \\(y=-3x+7\\), setting x=0 gives y=7.",note:"In context, the y-intercept usually represents the starting or initial amount."},
{id:"parallel-lines",formula:"m_1=m_2",topic:"Parallel lines",category:"Algebra",meaning:"Distinct nonvertical parallel lines have equal slopes.",symbols:"\\(m_1,m_2\\) = slopes of the two lines.",example:"A line parallel to \\(y=\\frac32x+4\\) also has slope \\(\\frac32\\).",note:"Parallel distinct lines have different intercepts and therefore never intersect."},
{id:"perpendicular-lines",formula:"m_1m_2=-1",topic:"Perpendicular slopes",category:"Algebra",meaning:"For nonvertical perpendicular lines, the slopes are negative reciprocals.",symbols:"\\(m_1,m_2\\) = slopes.",example:"If one line has slope \\(\\frac25\\), a perpendicular line has slope \\(-\\frac52\\).",note:"Horizontal and vertical lines are perpendicular but do not fit this product rule because vertical slope is undefined."},
{id:"average-rate",formula:"\\frac{\\Delta y}{\\Delta x}=\\frac{y_2-y_1}{x_2-x_1}",topic:"Average rate of change",category:"Algebra",meaning:"The average change in output per unit change in input over an interval.",symbols:"\\(\\Delta\\) means change.",example:"If a quantity rises from 20 to 44 while time rises from 2 to 8, the average rate is \\(24/6=4\\).",note:"For a linear function this rate is constant; for a nonlinear function it can change by interval."},
{id:"system-intersection",formula:"\\begin{cases}y=m_1x+b_1\\\\y=m_2x+b_2\\end{cases}",topic:"Systems of two linear equations",category:"Algebra",meaning:"A solution to a system is an ordered pair that satisfies both equations; graphically it is an intersection point.",symbols:"Each equation represents one line.",example:"\\(x+y=7\\) and \\(2x-y=2\\) give \\((x,y)=(3,4)\\).",note:"Use substitution or elimination—whichever makes a variable cancel most cleanly."},
{id:"system-count",formula:"m_1\\ne m_2\\Rightarrow1\\text{ intersection}",topic:"Number of solutions in a linear system",category:"Algebra",meaning:"Different slopes give one solution; equal slopes with different intercepts give none; identical lines give infinitely many.",symbols:"Compare slopes and intercepts after putting equations in comparable form.",example:"\\(y=2x+1\\) and \\(y=2x-5\\) have no solution because they are parallel.",note:"SAT parameter questions often ask which value makes a system have no solution or infinitely many solutions."},
{id:"inequality-flip",formula:"a<b,\\;c<0\\;\\Rightarrow\\;ac>bc",topic:"Inequality sign reversal",category:"Algebra",meaning:"Multiplying or dividing both sides of an inequality by a negative number reverses the inequality sign.",symbols:"c is negative.",example:"\\(-2x>8\\Rightarrow x<-4\\).",note:"Addition and subtraction do not reverse the inequality."},
{id:"compound-inequality",formula:"a<x<b",topic:"Compound inequalities",category:"Algebra",meaning:"x must satisfy both bounds at the same time.",symbols:"a = lower bound; b = upper bound.",example:"\\(2<x\\le7\\) means x is greater than 2 and at most 7.",note:"For 'or' inequalities, the solution is the union of the allowed regions."},

{id:"distributive",formula:"a(b+c)=ab+ac",topic:"Distributive property",category:"Advanced Math",meaning:"Multiply the outside factor by every term inside the parentheses.",symbols:"a,b,c may be numbers, variables, or expressions.",example:"\\(3(x-4)=3x-12\\).",note:"A negative sign outside parentheses changes every sign inside."},
{id:"difference-squares",formula:"a^2-b^2=(a-b)(a+b)",topic:"Difference of squares",category:"Advanced Math",meaning:"A difference of two perfect squares factors into conjugates.",symbols:"a and b are square-rootable expressions.",example:"\\(x^2-25=(x-5)(x+5)\\).",note:"There is no equivalent real-number factorization rule for \\(a^2+b^2\\)."},
{id:"perfect-square-plus",formula:"a^2+2ab+b^2=(a+b)^2",topic:"Perfect-square trinomial",category:"Advanced Math",meaning:"A trinomial whose outer terms are squares and middle term is twice their product.",symbols:"a,b = expressions.",example:"\\(x^2+6x+9=(x+3)^2\\).",note:"Use the sign of the middle term to choose plus or minus inside the squared binomial."},
{id:"perfect-square-minus",formula:"a^2-2ab+b^2=(a-b)^2",topic:"Perfect-square trinomial",category:"Advanced Math",meaning:"The subtraction version of the perfect-square identity.",symbols:"a,b = expressions.",example:"\\(x^2-10x+25=(x-5)^2\\).",note:"Recognizing this structure can make quadratic questions much faster."},
{id:"exp-product",formula:"a^m a^n=a^{m+n}",topic:"Product of powers",category:"Advanced Math",meaning:"When multiplying powers with the same base, add the exponents.",symbols:"a = common base; m,n = exponents.",example:"\\(x^3x^5=x^8\\).",note:"Do not add exponents when the bases differ."},
{id:"exp-quotient",formula:"\\frac{a^m}{a^n}=a^{m-n}",topic:"Quotient of powers",category:"Advanced Math",meaning:"When dividing powers with the same nonzero base, subtract the exponents.",symbols:"a must be nonzero.",example:"\\(x^7/x^3=x^4\\).",note:"A negative result in the exponent means the factor belongs in the denominator."},
{id:"power-power",formula:"(a^m)^n=a^{mn}",topic:"Power of a power",category:"Advanced Math",meaning:"Multiply the exponents when a power is raised to another power.",symbols:"m,n = exponents.",example:"\\((x^3)^4=x^{12}\\).",note:"This differs from multiplying two powers with the same base, where exponents are added."},
{id:"power-product",formula:"(ab)^n=a^n b^n",topic:"Power of a product",category:"Advanced Math",meaning:"An exponent outside a product applies to every factor.",symbols:"a,b = factors.",example:"\\((2x)^3=8x^3\\).",note:"An exponent does not distribute across addition: \\((a+b)^2\\ne a^2+b^2\\)."},
{id:"zero-exponent",formula:"a^0=1",topic:"Zero exponent",category:"Advanced Math",meaning:"Any nonzero base raised to the zero power equals 1.",symbols:"a must be nonzero.",example:"\\(7^0=1\\).",note:"The expression \\(0^0\\) is not treated by this rule."},
{id:"negative-exponent",formula:"a^{-n}=\\frac1{a^n}",topic:"Negative exponent",category:"Advanced Math",meaning:"A negative exponent indicates a reciprocal.",symbols:"a must be nonzero.",example:"\\(x^{-3}=1/x^3\\).",note:"The negative exponent does not make the value itself automatically negative."},
{id:"rational-exponent",formula:"a^{m/n}=\\sqrt[n]{a^m}",topic:"Rational exponents and radicals",category:"Advanced Math",meaning:"A fractional exponent represents a root and a power.",symbols:"n = root index; m = power.",example:"\\(x^{3/2}=\\sqrt{x^3}=(\\sqrt{x})^3\\) when defined.",note:"For even roots in real-number SAT problems, the radicand must be nonnegative."},
{id:"quadratic-standard",formula:"ax^2+bx+c=0",topic:"Standard quadratic form",category:"Advanced Math",meaning:"The standard form of a quadratic equation, with \\(a\\ne0\\).",symbols:"a = quadratic coefficient; b = linear coefficient; c = constant.",example:"\\(2x^2-5x-3=0\\) has a=2, b=-5, c=-3.",note:"Identify signs carefully before substituting into another formula."},
{id:"quadratic-formula",formula:"x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}",topic:"Quadratic formula",category:"Advanced Math",meaning:"Gives the solutions of any quadratic equation in standard form.",symbols:"a,b,c come from \\(ax^2+bx+c=0\\).",example:"For \\(x^2-5x+6=0\\), the formula gives x=2 or x=3.",note:"Put the entire numerator over \\(2a\\). The \\(\\pm\\) represents two possible solutions."},
{id:"discriminant",formula:"D=b^2-4ac",topic:"Discriminant",category:"Advanced Math",meaning:"The discriminant tells how many real solutions a quadratic has: D>0 gives two, D=0 gives one repeated real solution, and D<0 gives no real solutions.",symbols:"D = discriminant.",example:"For \\(x^2+4x+4=0\\), \\(D=16-16=0\\), so there is one repeated real root.",note:"This is especially useful in SAT questions asking for a parameter that creates exactly one solution."},
{id:"vertex-x",formula:"x_{\\text{vertex}}=-\\frac{b}{2a}",topic:"Axis of symmetry / vertex x-coordinate",category:"Advanced Math",meaning:"For \\(y=ax^2+bx+c\\), the vertex lies on the vertical line \\(x=-b/(2a)\\).",symbols:"a,b = coefficients from standard form.",example:"For \\(y=2x^2-8x+1\\), the vertex has x-coordinate 2.",note:"Substitute this x-value back into the function to find the vertex's y-coordinate."},
{id:"vertex-form",formula:"y=a(x-h)^2+k",topic:"Vertex form of a quadratic",category:"Advanced Math",meaning:"A quadratic written so its vertex is visible immediately at \\((h,k)\\).",symbols:"a controls vertical stretch/reflection; h,k = vertex coordinates.",example:"\\(y=-2(x-3)^2+5\\) has vertex \\((3,5)\\) and opens downward.",note:"The sign inside the parentheses is opposite the h-coordinate: \\(x-h\\)."},
{id:"factored-quadratic",formula:"y=a(x-r_1)(x-r_2)",topic:"Factored form of a quadratic",category:"Advanced Math",meaning:"A quadratic written so its zeros are visible at \\(x=r_1\\) and \\(x=r_2\\).",symbols:"\\(r_1,r_2\\) = roots/x-intercepts.",example:"\\(y=(x-2)(x+5)\\) has roots 2 and -5.",note:"A factor \\((x+5)\\) corresponds to the root x=-5."},
{id:"root-sum",formula:"r_1+r_2=-\\frac{b}{a}",topic:"Sum of quadratic roots",category:"Advanced Math",meaning:"For \\(ax^2+bx+c=0\\), the sum of the two roots is \\(-b/a\\).",symbols:"\\(r_1,r_2\\) = roots.",example:"For \\(2x^2-7x+3=0\\), the roots sum to \\(7/2\\).",note:"This can answer some SAT questions without solving the quadratic."},
{id:"root-product",formula:"r_1r_2=\\frac{c}{a}",topic:"Product of quadratic roots",category:"Advanced Math",meaning:"For \\(ax^2+bx+c=0\\), the product of the roots is \\(c/a\\).",symbols:"\\(r_1,r_2\\) = roots.",example:"For \\(3x^2+2x-8=0\\), the roots multiply to \\(-8/3\\).",note:"Useful when a question asks about a relationship between roots rather than the roots themselves."},
{id:"exponential-basic",formula:"y=ab^x",topic:"Exponential function",category:"Advanced Math",meaning:"An exponential model has a constant multiplicative factor b for each 1-unit increase in x.",symbols:"a = initial value at x=0; b = growth/decay factor.",example:"In \\(y=5(2)^x\\), the initial value is 5 and the output doubles each time x increases by 1.",note:"b>1 means growth; 0<b<1 means decay."},
{id:"exponential-growth",formula:"A=P(1+r)^t",topic:"Exponential growth",category:"Advanced Math",meaning:"A quantity starts at P and grows by decimal rate r each period for t periods.",symbols:"P = initial amount; r = growth rate as a decimal; t = number of periods.",example:"$200 growing 6% per year becomes \\(200(1.06)^t\\).",note:"Convert a percent to a decimal before adding it to 1."},
{id:"exponential-decay",formula:"A=P(1-r)^t",topic:"Exponential decay",category:"Advanced Math",meaning:"A quantity starts at P and decreases by decimal rate r each period.",symbols:"P = initial amount; r = decay rate; t = periods.",example:"A value decreasing 12% each year follows \\(A=P(0.88)^t\\).",note:"A 12% decrease leaves 88%, so the multiplier is 0.88."},
{id:"function-value",formula:"f(a)",topic:"Function notation",category:"Advanced Math",meaning:"f(a) is the output of function f when the input is a.",symbols:"a = input value.",example:"If \\(f(x)=x^2+3\\), then \\(f(4)=19\\).",note:"Substitute the entire input expression wherever x appears."},
{id:"function-shift",formula:"g(x)=f(x-h)+k",topic:"Function translations",category:"Advanced Math",meaning:"Relative to f, replacing x with x-h shifts the graph right h units and adding k shifts it up k units.",symbols:"h = horizontal shift; k = vertical shift.",example:"\\(g(x)=f(x-3)+2\\) is f shifted 3 right and 2 up.",note:"Horizontal shifts use the opposite-looking sign inside the function."},
{id:"absolute-value",formula:"|x-h|=k\\Rightarrow x=h\\pm k",topic:"Absolute value equations",category:"Advanced Math",meaning:"If k is nonnegative, x can lie k units to either side of h on the number line.",symbols:"h = center; k = distance.",example:"\\(|x-4|=7\\Rightarrow x=11\\) or \\(x=-3\\).",note:"If k<0, there are no real solutions because absolute value cannot be negative."},
{id:"rational-domain",formula:"\\text{denominator}\\ne0",topic:"Rational expressions",category:"Advanced Math",meaning:"Values that make a denominator zero are excluded from the domain.",symbols:"Denominator = expression below a fraction bar.",example:"For \\(\\frac{x+1}{x-5}\\), x cannot equal 5.",note:"A factor that cancels algebraically can still represent an excluded value from the original expression."},

{id:"ratio",formula:"a:b=\\frac{a}{b}",topic:"Ratios",category:"Problem-Solving and Data Analysis",meaning:"A ratio compares two quantities by division.",symbols:"a and b are compared quantities; b must be nonzero.",example:"A 3:5 ratio means \\(3/5\\), not 3+5.",note:"Keep the order of the quantities consistent with the wording."},
{id:"proportion",formula:"\\frac{a}{b}=\\frac{c}{d}\\Rightarrow ad=bc",topic:"Proportions",category:"Problem-Solving and Data Analysis",meaning:"Equal ratios can be solved by cross-multiplying.",symbols:"b and d must be nonzero.",example:"\\(\\frac{x}{6}=\\frac{4}{3}\\Rightarrow3x=24\\Rightarrow x=8\\).",note:"Units should correspond across the two ratios."},
{id:"unit-rate",formula:"\\text{unit rate}=\\frac{\\text{output quantity}}{\\text{input quantity}}",topic:"Rates and units",category:"Problem-Solving and Data Analysis",meaning:"A rate compares quantities with different units; a unit rate tells the output for one input unit.",symbols:"Units are part of the value.",example:"180 miles in 3 hours gives \\(180/3=60\\) miles per hour.",note:"Write the units next to each number to avoid inverting the rate."},
{id:"percent",formula:"\\text{percent}=\\frac{\\text{part}}{\\text{whole}}\\times100\\%",topic:"Percent",category:"Problem-Solving and Data Analysis",meaning:"A percent expresses a part as a fraction of 100 of the whole.",symbols:"part = selected amount; whole = total reference amount.",example:"18 out of 60 is \\(18/60=0.30=30\\%\\).",note:"Identify the correct whole before dividing."},
{id:"percent-change",formula:"\\%\\text{ change}=\\frac{\\text{new}-\\text{original}}{\\text{original}}\\times100\\%",topic:"Percent change",category:"Problem-Solving and Data Analysis",meaning:"Percent change compares the amount of change with the original amount.",symbols:"Original value is always the denominator.",example:"From 80 to 92: \\((92-80)/80=0.15\\), a 15% increase.",note:"A decrease produces a negative signed change; problems often ask for the positive magnitude of the percent decrease."},
{id:"percent-multiplier",formula:"\\text{new}=\\text{original}(1\\pm r)",topic:"Percent increase or decrease",category:"Problem-Solving and Data Analysis",meaning:"Multiply by 1+r for an increase and 1-r for a decrease, where r is the decimal rate.",symbols:"r = percent rate written as a decimal.",example:"A 20% discount on $75 gives \\(75(0.80)=60\\).",note:"Successive percent changes multiply; they do not simply add."},
{id:"reverse-percent",formula:"\\text{original}=\\frac{\\text{new}}{1\\pm r}",topic:"Reverse percent",category:"Problem-Solving and Data Analysis",meaning:"Undo a percent increase or decrease by dividing by its multiplier.",symbols:"Use 1+r after an increase and 1-r after a decrease.",example:"After a 25% increase, a value is 100. Original \\(=100/1.25=80\\).",note:"Do not subtract 25% of the new value; the percent was based on the original."},
{id:"mean",formula:"\\bar{x}=\\frac{\\sum x_i}{n}",topic:"Arithmetic mean",category:"Problem-Solving and Data Analysis",meaning:"The mean is the sum of all values divided by the number of values.",symbols:"\\(\\sum x_i\\) = sum of observations; n = number of observations.",example:"For 4, 7, 9, the mean is \\(20/3\\).",note:"If one data value changes by d, the total changes by d, which lets you update the mean quickly."},
{id:"weighted-mean",formula:"\\bar{x}=\\frac{\\sum w_ix_i}{\\sum w_i}",topic:"Weighted mean",category:"Problem-Solving and Data Analysis",meaning:"When values occur with different frequencies or weights, multiply each value by its weight before averaging.",symbols:"\\(w_i\\) = weight/frequency; \\(x_i\\) = value.",example:"Scores 80 and 90 weighted 40% and 60% give \\(0.4(80)+0.6(90)=86\\).",note:"Weights can be counts, frequencies, or proportions."},
{id:"range",formula:"\\text{range}=\\text{maximum}-\\text{minimum}",topic:"Range",category:"Problem-Solving and Data Analysis",meaning:"Range measures the full spread from the smallest value to the largest.",symbols:"maximum = largest observation; minimum = smallest.",example:"For 3, 5, 12, 18, the range is 15.",note:"Range is sensitive to extreme values."},
{id:"iqr",formula:"\\mathrm{IQR}=Q_3-Q_1",topic:"Interquartile range",category:"Problem-Solving and Data Analysis",meaning:"IQR measures the spread of the middle 50% of a data set.",symbols:"\\(Q_1\\) = first quartile; \\(Q_3\\) = third quartile.",example:"If \\(Q_1=12\\) and \\(Q_3=20\\), IQR=8.",note:"Like the median, IQR is less sensitive to extreme values than the full range."},
{id:"probability",formula:"P(A)=\\frac{\\text{favorable outcomes}}{\\text{total outcomes}}",topic:"Probability",category:"Problem-Solving and Data Analysis",meaning:"For equally likely outcomes, probability is favorable outcomes divided by all possible outcomes.",symbols:"P(A) = probability of event A.",example:"If 7 of 20 equally likely outcomes are favorable, \\(P(A)=7/20\\).",note:"Probabilities range from 0 to 1."},
{id:"complement",formula:"P(A^c)=1-P(A)",topic:"Complement rule",category:"Problem-Solving and Data Analysis",meaning:"The probability that event A does not happen is 1 minus the probability that it does.",symbols:"\\(A^c\\) = complement of A.",example:"If \\(P(A)=0.72\\), then \\(P(A^c)=0.28\\).",note:"This is often faster than counting all 'not A' outcomes directly."},
{id:"conditional-probability",formula:"P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}",topic:"Conditional probability",category:"Problem-Solving and Data Analysis",meaning:"The probability of A given that B has already occurred; the sample space is restricted to B.",symbols:"\\(A\\cap B\\) = both A and B; \\(P(B)>0\\).",example:"If 12 students are in B and 5 of those are also in A, then \\(P(A\\mid B)=5/12\\).",note:"In a two-way table, use the given condition's row or column total as the denominator."},
{id:"addition-probability",formula:"P(A\\cup B)=P(A)+P(B)-P(A\\cap B)",topic:"Probability of A or B",category:"Problem-Solving and Data Analysis",meaning:"Add the two probabilities and subtract their overlap so it is not counted twice.",symbols:"\\(A\\cup B\\) = A or B; \\(A\\cap B\\) = both.",example:"If \\(P(A)=0.5\\), \\(P(B)=0.4\\), and \\(P(A\\cap B)=0.2\\), then \\(P(A\\cup B)=0.7\\).",note:"For mutually exclusive events the overlap is zero."},
{id:"relative-frequency",formula:"\\text{relative frequency}=\\frac{\\text{category count}}{\\text{relevant total}}",topic:"Relative frequency",category:"Problem-Solving and Data Analysis",meaning:"Relative frequency expresses a count as a proportion of the relevant group.",symbols:"The denominator changes depending on whether the question asks joint, marginal, or conditional frequency.",example:"If 30 of 120 students chose option A, its overall relative frequency is 0.25.",note:"Read two-way-table denominators carefully."},
{id:"residual",formula:"\\text{residual}=y-\\hat y",topic:"Residuals",category:"Problem-Solving and Data Analysis",meaning:"A residual is actual value minus predicted value from a model.",symbols:"y = observed value; \\(\\hat y\\) = predicted value.",example:"If actual y=18 and predicted y=15.5, the residual is 2.5.",note:"Positive residual means the point lies above the model; negative means below."},
{id:"sample-estimate",formula:"\\text{population estimate}\\approx\\text{sample statistic}",topic:"Inference from a random sample",category:"Problem-Solving and Data Analysis",meaning:"A statistic from a representative random sample can be used to estimate the corresponding population parameter.",symbols:"Examples include sample mean and sample proportion.",example:"If 62% of a random sample supports a proposal, 62% is the point estimate for the population proportion.",note:"Random sampling supports generalization to the sampled population; random assignment supports causal conclusions."},
{id:"margin-error",formula:"\\text{estimate}\\pm\\text{margin of error}",topic:"Margin of error",category:"Problem-Solving and Data Analysis",meaning:"A margin of error gives a plausible interval around a sample estimate.",symbols:"Estimate = sample statistic; margin of error = stated uncertainty.",example:"An estimate of 54% with margin 3 percentage points gives 51% to 57%.",note:"Larger random samples generally produce smaller margins of error, all else equal."},

{id:"rectangle-area",formula:"A=\\ell w",topic:"Area of a rectangle",category:"Geometry and Trigonometry",meaning:"Rectangle area equals length times width.",symbols:"\\(\\ell\\) = length; w = width.",example:"A 7 by 4 rectangle has area 28 square units.",note:"Area uses squared units."},
{id:"rectangle-perimeter",formula:"P=2\\ell+2w",topic:"Perimeter of a rectangle",category:"Geometry and Trigonometry",meaning:"Add all four side lengths of a rectangle.",symbols:"\\(\\ell\\) = length; w = width.",example:"A 7 by 4 rectangle has perimeter 22 units.",note:"Perimeter is a length, not an area."},
{id:"square-area",formula:"A=s^2",topic:"Area of a square",category:"Geometry and Trigonometry",meaning:"A square has equal side lengths, so area is side times side.",symbols:"s = side length.",example:"If s=6, area=36.",note:"If area is given, take the positive square root to find side length."},
{id:"triangle-area",formula:"A=\\frac12 bh",topic:"Area of a triangle",category:"Geometry and Trigonometry",meaning:"Triangle area is half the product of a base and its perpendicular height.",symbols:"b = chosen base; h = perpendicular height.",example:"b=10 and h=7 gives area 35.",note:"The height must be perpendicular to the base; it can lie outside an obtuse triangle."},
{id:"trapezoid-area",formula:"A=\\frac12(b_1+b_2)h",topic:"Area of a trapezoid",category:"Geometry and Trigonometry",meaning:"Multiply the average of the two parallel bases by the perpendicular height.",symbols:"\\(b_1,b_2\\) = parallel bases; h = height.",example:"Bases 8 and 14 with height 5 give area 55.",note:"Only the parallel sides are the bases in this formula."},
{id:"circle-circumference",formula:"C=2\\pi r=\\pi d",topic:"Circumference of a circle",category:"Geometry and Trigonometry",meaning:"Circumference is the distance around a circle.",symbols:"r = radius; d = diameter = 2r.",example:"If r=5, \\(C=10\\pi\\).",note:"Circumference is linear units, while area is square units."},
{id:"circle-area",formula:"A=\\pi r^2",topic:"Area of a circle",category:"Geometry and Trigonometry",meaning:"Circle area is pi times the square of the radius.",symbols:"r = radius.",example:"If r=4, \\(A=16\\pi\\).",note:"If given diameter, divide by 2 before using the area formula."},
{id:"diameter-radius",formula:"d=2r",topic:"Radius and diameter",category:"Geometry and Trigonometry",meaning:"The diameter spans the circle through its center and is twice the radius.",symbols:"d = diameter; r = radius.",example:"Diameter 18 means radius 9.",note:"Many SAT circle errors come from using the diameter as r."},
{id:"arc-length-deg",formula:"L=\\frac{\\theta}{360^\\circ}(2\\pi r)",topic:"Arc length in degrees",category:"Geometry and Trigonometry",meaning:"An arc's length is the same fraction of the circumference as its central angle is of 360 degrees.",symbols:"\\(\\theta\\) = central angle in degrees; r = radius.",example:"A 90° arc in a circle of radius 8 has length \\(\\frac14(16\\pi)=4\\pi\\).",note:"Use the central angle, not an inscribed angle, in the fraction."},
{id:"arc-length-rad",formula:"L=r\\theta",topic:"Arc length in radians",category:"Geometry and Trigonometry",meaning:"When the central angle is measured in radians, arc length equals radius times angle.",symbols:"r = radius; \\(\\theta\\) = angle in radians.",example:"If r=6 and \\(\\theta=\\pi/3\\), then \\(L=2\\pi\\).",note:"This compact formula requires radians."},
{id:"sector-area-deg",formula:"A_{\\text{sector}}=\\frac{\\theta}{360^\\circ}\\pi r^2",topic:"Sector area in degrees",category:"Geometry and Trigonometry",meaning:"A sector's area is the same fraction of the circle's area as its central angle is of 360 degrees.",symbols:"\\(\\theta\\) = central angle in degrees.",example:"A 60° sector of radius 6 has area \\(6\\pi\\).",note:"A sector is a fraction of area, while an arc is a fraction of circumference."},
{id:"sector-area-rad",formula:"A_{\\text{sector}}=\\frac12r^2\\theta",topic:"Sector area in radians",category:"Geometry and Trigonometry",meaning:"When angle is measured in radians, sector area is one-half r squared times theta.",symbols:"r = radius; \\(\\theta\\) = radians.",example:"If r=4 and \\(\\theta=\\pi/2\\), area \\(=4\\pi\\).",note:"Use this only when theta is in radians."},
{id:"circle-equation",formula:"(x-h)^2+(y-k)^2=r^2",topic:"Equation of a circle",category:"Geometry and Trigonometry",meaning:"A circle centered at \\((h,k)\\) with radius r.",symbols:"h,k = center coordinates; r = radius.",example:"\\((x-3)^2+(y+2)^2=25\\) has center \\((3,-2)\\) and radius 5.",note:"The signs inside parentheses are opposite the center coordinates."},
{id:"central-angle",formula:"m\\widehat{AB}=m\\angle AOB",topic:"Central angles and arcs",category:"Geometry and Trigonometry",meaning:"The degree measure of a minor arc equals the degree measure of its central angle.",symbols:"O = circle center; arc AB is intercepted by central angle AOB.",example:"A 72° central angle intercepts a 72° arc.",note:"Arc length is not the same thing as arc degree measure."},
{id:"inscribed-angle",formula:"m\\angle APB=\\frac12m\\widehat{AB}",topic:"Inscribed angle theorem",category:"Geometry and Trigonometry",meaning:"An inscribed angle equals half the measure of its intercepted arc.",symbols:"P lies on the circle.",example:"An inscribed angle intercepting a 100° arc measures 50°.",note:"A central angle intercepting the same arc would measure the full 100°."},
{id:"tangent-radius",formula:"OT\\perp\\text{ tangent at }T",topic:"Radius and tangent",category:"Geometry and Trigonometry",meaning:"A radius drawn to a point of tangency is perpendicular to the tangent line.",symbols:"O = center; T = point of tangency.",example:"If OT is a radius and a line is tangent at T, the angle between them is 90°.",note:"This often creates a right triangle inside a circle problem."},
{id:"pythagorean",formula:"a^2+b^2=c^2",topic:"Pythagorean theorem",category:"Geometry and Trigonometry",meaning:"In a right triangle, the squares of the legs sum to the square of the hypotenuse.",symbols:"a,b = legs; c = hypotenuse opposite the 90° angle.",example:"Legs 6 and 8 give \\(c=10\\).",note:"c must be the hypotenuse."},
{id:"distance",formula:"d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}",topic:"Distance formula",category:"Geometry and Trigonometry",meaning:"The straight-line distance between two coordinate-plane points, derived from the Pythagorean theorem.",symbols:"\\((x_1,y_1)\\), \\((x_2,y_2)\\) = points.",example:"Between \\((1,2)\\) and \\((4,6)\\), \\(d=5\\).",note:"Subtract coordinates in matching order; squaring removes the sign."},
{id:"midpoint",formula:"M=\\left(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2}\\right)",topic:"Midpoint formula",category:"Geometry and Trigonometry",meaning:"The midpoint coordinates are the averages of the endpoint coordinates.",symbols:"M = midpoint.",example:"Endpoints \\((2,5)\\) and \\((8,1)\\) have midpoint \\((5,3)\\).",note:"Average x-values together and y-values together."},
{id:"45-45-90",formula:"x:x:x\\sqrt2",topic:"45°-45°-90° triangle",category:"Geometry and Trigonometry",meaning:"An isosceles right triangle has equal legs x and hypotenuse \\(x\\sqrt2\\).",symbols:"x = either leg.",example:"If a leg is 7, the hypotenuse is \\(7\\sqrt2\\).",note:"The hypotenuse is always the side multiplied by \\(\\sqrt2\\)."},
{id:"30-60-90",formula:"x:x\\sqrt3:2x",topic:"30°-60°-90° triangle",category:"Geometry and Trigonometry",meaning:"The sides opposite 30°, 60°, and 90° are in the ratio \\(1:\\sqrt3:2\\).",symbols:"x = short leg opposite 30°.",example:"If the short leg is 5, the long leg is \\(5\\sqrt3\\) and hypotenuse is 10.",note:"Match each side to the angle opposite it."},
{id:"sine",formula:"\\sin\\theta=\\frac{\\text{opposite}}{\\text{hypotenuse}}",topic:"Sine in a right triangle",category:"Geometry and Trigonometry",meaning:"Sine compares the side opposite an acute angle with the hypotenuse.",symbols:"\\(\\theta\\) = reference angle.",example:"If opposite=6 and hypotenuse=10, \\(\\sin\\theta=0.6\\).",note:"Choose opposite/adjacent relative to the specific reference angle."},
{id:"cosine",formula:"\\cos\\theta=\\frac{\\text{adjacent}}{\\text{hypotenuse}}",topic:"Cosine in a right triangle",category:"Geometry and Trigonometry",meaning:"Cosine compares the adjacent leg with the hypotenuse.",symbols:"\\(\\theta\\) = reference angle.",example:"If adjacent=8 and hypotenuse=10, \\(\\cos\\theta=0.8\\).",note:"The hypotenuse is always opposite the right angle."},
{id:"tangent",formula:"\\tan\\theta=\\frac{\\text{opposite}}{\\text{adjacent}}",topic:"Tangent in a right triangle",category:"Geometry and Trigonometry",meaning:"Tangent compares the opposite leg with the adjacent leg.",symbols:"\\(\\theta\\) = reference angle.",example:"If opposite=6 and adjacent=8, \\(\\tan\\theta=3/4\\).",note:"Tangent does not use the hypotenuse."},
{id:"tan-sin-cos",formula:"\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}",topic:"Trig relationship",category:"Geometry and Trigonometry",meaning:"Tangent equals sine divided by cosine wherever cosine is nonzero.",symbols:"\\(\\theta\\) = angle.",example:"If \\(\\sin\\theta=3/5\\) and \\(\\cos\\theta=4/5\\), then \\(\\tan\\theta=3/4\\).",note:"This relationship can connect trig values without side lengths."},
{id:"complementary-trig",formula:"\\sin\\theta=\\cos(90^\\circ-\\theta)",topic:"Complementary-angle trig",category:"Geometry and Trigonometry",meaning:"The sine of an acute angle equals the cosine of its complement.",symbols:"Complementary angles sum to 90°.",example:"\\(\\sin30^\\circ=\\cos60^\\circ=1/2\\).",note:"This follows because opposite and adjacent legs swap roles for the two acute angles."},
{id:"degree-radian",formula:"180^\\circ=\\pi\\text{ radians}",topic:"Degrees and radians",category:"Geometry and Trigonometry",meaning:"Use 180° = π radians to convert between angle units.",symbols:"Multiply degrees by \\(\\pi/180\\) to get radians; multiply radians by \\(180/\\pi\\) to get degrees.",example:"60° = \\(60\\cdot\\pi/180=\\pi/3\\).",note:"A full circle is 360° = \\(2\\pi\\) radians."},
{id:"triangle-sum",formula:"A+B+C=180^\\circ",topic:"Triangle angle sum",category:"Geometry and Trigonometry",meaning:"The three interior angles of any Euclidean triangle sum to 180 degrees.",symbols:"A,B,C = interior angle measures.",example:"If two angles are 52° and 71°, the third is 57°.",note:"This works for acute, right, and obtuse triangles."},
{id:"exterior-triangle",formula:"m\\angle_{\\text{ext}}=m\\angle_1+m\\angle_2",topic:"Exterior angle theorem",category:"Geometry and Trigonometry",meaning:"A triangle's exterior angle equals the sum of the two remote interior angles.",symbols:"\\(\\angle_1,\\angle_2\\) = nonadjacent interior angles.",example:"Remote interior angles 35° and 68° give exterior angle 103°.",note:"The exterior angle and adjacent interior angle are supplementary."},
{id:"polygon-sum",formula:"S=(n-2)180^\\circ",topic:"Interior-angle sum of a polygon",category:"Geometry and Trigonometry",meaning:"The sum of interior angles of an n-sided polygon.",symbols:"n = number of sides.",example:"A hexagon has sum \\((6-2)180=720^\\circ\\).",note:"For a regular polygon, divide this sum by n to get each interior angle."},
{id:"regular-exterior",formula:"E=\\frac{360^\\circ}{n}",topic:"Exterior angle of a regular polygon",category:"Geometry and Trigonometry",meaning:"Equal exterior angles of a regular n-gon divide a full 360° turn equally.",symbols:"n = number of sides.",example:"A regular octagon has exterior angle 45°.",note:"Each regular interior angle is \\(180^\\circ-E\\)."},
{id:"similarity",formula:"\\frac{a_1}{a_2}=\\frac{b_1}{b_2}=k",topic:"Similar figures",category:"Geometry and Trigonometry",meaning:"Corresponding lengths in similar figures have a constant scale factor k.",symbols:"k = linear scale factor.",example:"If the scale factor is 3, every corresponding length triples.",note:"Corresponding angles stay equal."},
{id:"scale-area",formula:"\\frac{A_2}{A_1}=k^2",topic:"Scale factor and area",category:"Geometry and Trigonometry",meaning:"When all lengths scale by k, area scales by \\(k^2\\).",symbols:"k = linear scale factor.",example:"Doubling side lengths multiplies area by 4.",note:"Do not use k itself for area changes."},
{id:"scale-volume",formula:"\\frac{V_2}{V_1}=k^3",topic:"Scale factor and volume",category:"Geometry and Trigonometry",meaning:"When all lengths scale by k, volume scales by \\(k^3\\).",symbols:"k = linear scale factor.",example:"Tripling all dimensions multiplies volume by 27.",note:"Volume changes faster than length because it is three-dimensional."},
{id:"rect-prism-volume",formula:"V=\\ell wh",topic:"Volume of a rectangular prism",category:"Geometry and Trigonometry",meaning:"Volume equals length times width times height.",symbols:"\\(\\ell,w,h\\) = perpendicular dimensions.",example:"A 3×4×5 prism has volume 60 cubic units.",note:"Volume uses cubic units."},
{id:"rect-prism-sa",formula:"SA=2(\\ell w+\\ell h+wh)",topic:"Surface area of a rectangular prism",category:"Geometry and Trigonometry",meaning:"Add the areas of the three pairs of congruent rectangular faces.",symbols:"\\(\\ell,w,h\\) = dimensions.",example:"For 2×3×4, surface area is \\(2(6+8+12)=52\\).",note:"Surface area uses square units, not cubic units."},
{id:"prism-diagonal",formula:"d=\\sqrt{\\ell^2+w^2+h^2}",topic:"Space diagonal of a rectangular prism",category:"Geometry and Trigonometry",meaning:"The longest corner-to-corner distance in a rectangular prism, found by applying the Pythagorean theorem twice.",symbols:"\\(\\ell,w,h\\) = dimensions.",example:"A 3×4×12 prism has diagonal 13.",note:"Distinguish a face diagonal from the full space diagonal."},
{id:"cylinder-volume",formula:"V=\\pi r^2h",topic:"Volume of a cylinder",category:"Geometry and Trigonometry",meaning:"Cylinder volume equals circular base area times height.",symbols:"r = base radius; h = perpendicular height.",example:"r=3 and h=5 gives \\(45\\pi\\).",note:"This formula appears on the SAT reference sheet."},
{id:"cylinder-sa",formula:"SA=2\\pi r^2+2\\pi rh",topic:"Surface area of a closed cylinder",category:"Geometry and Trigonometry",meaning:"Two circular bases plus the rectangular lateral surface.",symbols:"r = radius; h = height.",example:"r=2, h=6 gives \\(8\\pi+24\\pi=32\\pi\\).",note:"If the cylinder is open, remove the area of the missing base(s)."},
{id:"sphere-volume",formula:"V=\\frac43\\pi r^3",topic:"Volume of a sphere",category:"Geometry and Trigonometry",meaning:"The volume enclosed by a sphere of radius r.",symbols:"r = radius.",example:"r=3 gives \\(V=36\\pi\\).",note:"This formula appears on the SAT reference sheet."},
{id:"sphere-area",formula:"SA=4\\pi r^2",topic:"Surface area of a sphere",category:"Geometry and Trigonometry",meaning:"The total outer area of a sphere.",symbols:"r = radius.",example:"r=5 gives \\(SA=100\\pi\\).",note:"Surface area uses \\(r^2\\); volume uses \\(r^3\\)."},
{id:"cone-volume",formula:"V=\\frac13\\pi r^2h",topic:"Volume of a cone",category:"Geometry and Trigonometry",meaning:"A cone has one-third the volume of a cylinder with the same base and height.",symbols:"r = radius; h = perpendicular height.",example:"r=3, h=4 gives \\(12\\pi\\).",note:"Use perpendicular height, not slant height."},
{id:"pyramid-volume",formula:"V=\\frac13Bh",topic:"Volume of a pyramid",category:"Geometry and Trigonometry",meaning:"A pyramid has one-third the volume of a prism with the same base area and height.",symbols:"B = base area; h = perpendicular height.",example:"A rectangular base 6×8 with height 9 gives \\(V=144\\).",note:"For a rectangular base, \\(B=\\ell w\\)."}
];

const search=document.getElementById("formula-search"),
category=document.getElementById("formula-category"),
statusButtons=[...document.querySelectorAll(".vocab-status-filter-button")],
expressionEl=document.getElementById("formula-expression"),
topicEl=document.getElementById("formula-topic"),
promptEl=document.getElementById("formula-prompt"),
iconEl=document.getElementById("formula-icon"),
catEl=document.getElementById("formula-category-label"),
solvedStatusEl=document.getElementById("formula-solved-status"),
reviewStatusEl=document.getElementById("formula-review-status"),
meaningEl=document.getElementById("formula-meaning"),
symbolsEl=document.getElementById("formula-symbols"),
symbolsWrap=document.getElementById("formula-symbols-wrap"),
exampleEl=document.getElementById("formula-example"),
noteEl=document.getElementById("formula-note"),
noteWrap=document.getElementById("formula-note-wrap"),
definition=document.getElementById("formula-definition"),
reveal=document.getElementById("reveal-button"),
reviewButton=document.getElementById("review-button"),
learningButton=document.getElementById("learning-button"),
knownButton=document.getElementById("known-button"),
actions=document.getElementById("formula-actions"),
empty=document.getElementById("formula-empty"),
card=document.getElementById("formula-card"),
progressText=document.getElementById("formula-progress-text"),
progressBar=document.getElementById("formula-progress-bar"),
countEl=document.getElementById("formula-count"),
statusSummary=document.getElementById("formula-status-summary");

const STATE_KEY="lexlogica_formula_fluency_state_v1";

const PROMPTS={
  "slope-intercept":"A line has slope m and y-intercept b. How can its equation be written?",
  "slope-two-points":"Given two points (x₁, y₁) and (x₂, y₂), how do you find the slope between them?",
  "point-slope":"A line has slope m and passes through (x₁, y₁). What equation form can represent the line?",
  "standard-linear":"What is the standard form of a linear equation in x and y?",
  "linear-solve":"For ax + b = c, how can x be isolated?",
  "direct-variation":"If y varies directly with x with constant of proportionality k, how are y and x related?",
  "x-intercept":"What value do you set y equal to when finding an x-intercept?",
  "y-intercept":"What value do you set x equal to when finding a y-intercept?",
  "parallel-lines":"What relationship do the slopes of two nonvertical parallel lines have?",
  "perpendicular-lines":"What relationship do the slopes of two nonvertical perpendicular lines have?",
  "inequality-flip":"What happens to an inequality sign when both sides are multiplied or divided by a negative number?",
  "difference-squares":"How does a difference of two perfect squares factor?",
  "quadratic-formula":"What formula gives the solutions of ax² + bx + c = 0?",
  "discriminant":"What expression determines how many real solutions a quadratic equation has?",
  "vertex-x":"For y = ax² + bx + c, how do you find the x-coordinate of the vertex?",
  "exponential-growth":"A quantity starts at P and grows by rate r each period. What model gives its value after t periods?",
  "exponential-decay":"A quantity starts at P and decreases by rate r each period. What model gives its value after t periods?",
  "percent":"How do you calculate what percent a part is of a whole?",
  "percent-change":"How do you calculate percent change from an original value to a new value?",
  "mean":"How do you calculate the arithmetic mean of n values?",
  "weighted-mean":"How do you calculate a weighted mean?",
  "probability":"For equally likely outcomes, how do you calculate the probability of event A?",
  "complement":"If you know P(A), how do you find the probability that A does not occur?",
  "conditional-probability":"How do you calculate the probability of A given that B has occurred?",
  "rectangle-area":"What is the area of a rectangle with length ℓ and width w?",
  "triangle-area":"What is the area of a triangle with base b and perpendicular height h?",
  "trapezoid-area":"What is the area of a trapezoid with parallel bases b₁ and b₂ and height h?",
  "circle-circumference":"What is the circumference of a circle with radius r?",
  "circle-area":"What is the area of a circle with radius r?",
  "arc-length-deg":"A circle has radius r and central angle θ measured in degrees. What is the arc length?",
  "arc-length-rad":"A circle has radius r and central angle θ measured in radians. What is the arc length?",
  "sector-area-deg":"A sector has radius r and central angle θ measured in degrees. What is its area?",
  "sector-area-rad":"A sector has radius r and central angle θ measured in radians. What is its area?",
  "circle-equation":"A circle has center (h, k) and radius r. What is its equation?",
  "pythagorean":"In a right triangle with legs a and b and hypotenuse c, what relationship connects the side lengths?",
  "distance":"How do you find the distance between (x₁, y₁) and (x₂, y₂)?",
  "midpoint":"How do you find the midpoint of a segment with endpoints (x₁, y₁) and (x₂, y₂)?",
  "45-45-90":"What is the side-length ratio in a 45°-45°-90° triangle?",
  "30-60-90":"What is the side-length ratio in a 30°-60°-90° triangle?",
  "sine":"In a right triangle, how is sin θ defined?",
  "cosine":"In a right triangle, how is cos θ defined?",
  "tangent":"In a right triangle, how is tan θ defined?",
  "degree-radian":"What equality connects degrees and radians?",
  "triangle-sum":"What is the sum of the three interior angles of a triangle?",
  "polygon-sum":"What formula gives the sum of the interior angles of an n-sided polygon?",
  "regular-exterior":"What is the measure of each exterior angle of a regular n-gon?",
  "similarity":"If two figures are similar with linear scale factor k, how do corresponding side lengths compare?",
  "scale-area":"If all lengths scale by a factor of k, by what factor does area change?",
  "scale-volume":"If all lengths scale by a factor of k, by what factor does volume change?",
  "rect-prism-volume":"What is the volume of a rectangular prism with length ℓ, width w, and height h?",
  "rect-prism-sa":"What is the surface area of a rectangular prism with length ℓ, width w, and height h?",
  "cylinder-volume":"What is the volume of a cylinder with radius r and height h?",
  "cylinder-sa":"What is the surface area of a closed cylinder with radius r and height h?",
  "sphere-volume":"What is the volume of a sphere with radius r?",
  "sphere-area":"What is the surface area of a sphere with radius r?",
  "cone-volume":"What is the volume of a cone with radius r and perpendicular height h?",
  "pyramid-volume":"What is the volume of a pyramid with base area B and perpendicular height h?"
};

function promptFor(item){
  return PROMPTS[item.id]||("What formula or relationship should you know for "+item.topic.toLowerCase()+"?");
}

function iconFor(item){
  const id=item.id;
  let kind="algebra";
  if(/cylinder/.test(id))kind="cylinder";
  else if(/sphere/.test(id))kind="sphere";
  else if(/circle|arc|sector|tangent-radius/.test(id))kind="circle";
  else if(/triangle|pythagorean|sine|cosine|tangent|trig/.test(id))kind="triangle";
  else if(/percent|probability|mean|range|residual|sample|margin|ratio|proportion|frequency/.test(id))kind="data";
  else if(/quadratic|parabola|vertex|discriminant|root/.test(id))kind="parabola";
  else if(/rect-prism|prism|pyramid|cone/.test(id))kind="solid";
  else if(/line|slope|intercept|system|variation|linear/.test(id))kind="line";

  const icons={
    cylinder:'<svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="15" rx="17" ry="7" fill="#ccfbf1" stroke="#0f766e" stroke-width="2"/><path d="M15 15v31c0 3.9 7.6 7 17 7s17-3.1 17-7V15" fill="#f0fdfa" stroke="#0f766e" stroke-width="2"/><ellipse cx="32" cy="46" rx="17" ry="7" fill="#e6fffa" stroke="#0f766e" stroke-width="2"/></svg>',
    sphere:'<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/><ellipse cx="32" cy="32" rx="20" ry="8" stroke="#0284c7" stroke-width="1.8" opacity=".75"/><path d="M32 12c7 5 10 12 10 20S39 47 32 52M32 12c-7 5-10 12-10 20s3 15 10 20" stroke="#0284c7" stroke-width="1.5" opacity=".7"/></svg>',
    circle:'<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" fill="#fce7f3" stroke="#db2777" stroke-width="2"/><path d="M32 32L49 32" stroke="#db2777" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="32" r="2.8" fill="#db2777"/></svg>',
    triangle:'<svg viewBox="0 0 64 64" fill="none"><path d="M13 49L31 15L52 49H13Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><path d="M22 49V40H31" stroke="#d97706" stroke-width="2"/><path d="M18 44c2-3 4.8-4.5 8-4.5" stroke="#d97706" stroke-width="1.8" stroke-linecap="round"/></svg>',
    data:'<svg viewBox="0 0 64 64" fill="none"><rect x="12" y="34" width="9" height="18" rx="3" fill="#a7f3d0"/><rect x="27" y="25" width="9" height="27" rx="3" fill="#6ee7b7"/><rect x="42" y="15" width="9" height="37" rx="3" fill="#34d399"/><path d="M11 53h42" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/></svg>',
    parabola:'<svg viewBox="0 0 64 64" fill="none"><path d="M13 48C20 18 44 18 51 48" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="31" r="3.5" fill="#c4b5fd"/><path d="M10 52H54M32 10V55" stroke="#cbd5e1" stroke-width="1.5"/></svg>',
    solid:'<svg viewBox="0 0 64 64" fill="none"><path d="M18 21L35 13L49 22L31 31L18 21Z" fill="#ede9fe" stroke="#6d28d9" stroke-width="2"/><path d="M18 21V43L31 51V31L18 21Z" fill="#f5f3ff" stroke="#6d28d9" stroke-width="2"/><path d="M31 31L49 22V43L31 51V31Z" fill="#ddd6fe" stroke="#6d28d9" stroke-width="2"/></svg>',
    line:'<svg viewBox="0 0 64 64" fill="none"><path d="M11 50L51 18" stroke="#0f766e" stroke-width="3" stroke-linecap="round"/><circle cx="19" cy="44" r="4" fill="#5eead4"/><circle cx="43" cy="25" r="4" fill="#2dd4bf"/><path d="M10 54H54M14 10V54" stroke="#cbd5e1" stroke-width="1.5"/></svg>',
    algebra:'<svg viewBox="0 0 64 64" fill="none"><rect x="11" y="13" width="42" height="38" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/><path d="M20 27h10M25 22v10M37 24h9M37 31h9M21 41l8-7M21 34l8 7" stroke="#3b82f6" stroke-width="2.3" stroke-linecap="round"/></svg>'
  };
  return icons[kind];
}

function loadState(){
    const saved=JSON.parse(localStorage.getItem(STATE_KEY)||"{}");
    const state={};
    formulas.forEach(item=>{
        const old=saved[item.id]||{};
        state[item.id]={solved:old.solved===true,review:old.review===true};
    });
    return state;
}
let itemState=loadState();
function saveState(){localStorage.setItem(STATE_KEY,JSON.stringify(itemState));}

let currentStatusFilter="all";
let filtered=[];
let index=0;

function shuffle(items){
    const result=[...items];
    for(let i=result.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [result[i],result[j]]=[result[j],result[i]];
    }
    return result;
}
function getState(item){return itemState[item.id]||{solved:false,review:false};}
function searchableText(item){
    return [item.formula,item.topic,item.category,item.meaning,item.symbols,item.example,item.note]
        .join(" ").replace(/\\\\[a-zA-Z]+/g," ").replace(/[{}^_]/g," ").toLowerCase();
}
function matches(item,excludeId=""){
    if(excludeId&&item.id===excludeId)return false;
    const query=search.value.trim().toLowerCase();
    const selected=category.value;
    const state=getState(item);
    if(query&&!searchableText(item).includes(query))return false;
    if(selected!=="all"&&item.category!==selected)return false;
    if(currentStatusFilter==="solved"&&!state.solved)return false;
    if(currentStatusFilter==="unsolved"&&state.solved)return false;
    if(currentStatusFilter==="review"&&!state.review)return false;
    return true;
}
function findMatching(excludeId=""){return shuffle(formulas.filter(item=>matches(item,excludeId)));}

function resetCardUI(){
    definition.classList.add("hidden");
    actions.classList.remove("hidden");
    reveal.classList.remove("hidden");
    card.classList.remove("vocab-solved-flash","vocab-learning-flash");
    reviewButton.textContent="☆ Mark for Review";
    reviewButton.classList.remove("active");
    reviewButton.setAttribute("aria-pressed","false");
    reviewStatusEl.classList.add("hidden");
    knownButton.classList.remove("active");
    knownButton.setAttribute("aria-pressed","false");
    learningButton.classList.remove("active");
    learningButton.setAttribute("aria-pressed","false");
}
function updateStatusUI(item){
    const state=getState(item);
    solvedStatusEl.textContent=state.solved?"Solved":"Unsolved";
    solvedStatusEl.className="vocab-status-chip "+(state.solved?"solved":"unsolved");
    reviewStatusEl.classList.toggle("hidden",!state.review);
    reviewButton.textContent=state.review?"★ In Review":"☆ Mark for Review";
    reviewButton.classList.toggle("active",state.review);
    reviewButton.setAttribute("aria-pressed",state.review?"true":"false");
    knownButton.classList.toggle("active",state.solved);
    knownButton.setAttribute("aria-pressed",state.solved?"true":"false");
    learningButton.classList.toggle("active",!state.solved);
    learningButton.setAttribute("aria-pressed",state.solved?"false":"true");
}
function updateProgress(){
    const solved=formulas.filter(item=>getState(item).solved).length;
    const review=formulas.filter(item=>getState(item).review).length;
    progressText.textContent=solved+" of "+formulas.length+" solved";
    progressBar.style.width=(solved/formulas.length*100)+"%";
    statusSummary.textContent=review+" review · "+(formulas.length-solved)+" unsolved";
}
function typeset(nodes){
    if(window.MathJax&&MathJax.typesetPromise){
        MathJax.typesetClear(nodes);
        MathJax.typesetPromise(nodes).catch(()=>{});
    }
}
function render(){
    resetCardUI();
    if(!filtered.length){
        card.classList.add("hidden");
        empty.classList.remove("hidden");
        countEl.textContent="0 formulas";
        updateProgress();
        return;
    }
    card.classList.remove("hidden");
    empty.classList.add("hidden");
    const item=filtered[index];
    catEl.textContent=item.category;
    topicEl.textContent=item.topic;
    promptEl.textContent=promptFor(item);
    iconEl.innerHTML=iconFor(item);
    expressionEl.innerHTML="\\\\["+item.formula+"\\\\]";
    meaningEl.innerHTML=item.meaning;
    symbolsEl.innerHTML=item.symbols||"";
    exampleEl.innerHTML=item.example||"";
    noteEl.innerHTML=item.note||"";
    symbolsWrap.classList.toggle("hidden",!item.symbols);
    noteWrap.classList.toggle("hidden",!item.note);
    updateStatusUI(item);
    countEl.textContent=filtered.length+" cards";
    updateProgress();
}
function rebuildList(excludeId=""){
    filtered=findMatching(excludeId);
    index=0;
    render();
}
function setStatusFilter(status){
    currentStatusFilter=status;
    statusButtons.forEach(button=>button.classList.toggle("active",button.dataset.status===status));
    rebuildList();
}

reveal.addEventListener("click",()=>{
    definition.classList.remove("hidden");
    actions.classList.remove("hidden");
    reveal.classList.add("hidden");
    typeset([expressionEl,meaningEl,symbolsEl,exampleEl,noteEl]);
});
reviewButton.addEventListener("click",()=>{
    if(!filtered.length)return;
    const item=filtered[index];
    itemState[item.id].review=!itemState[item.id].review;
    saveState();
    if(currentStatusFilter==="review")rebuildList(item.id);
    else{updateStatusUI(item);updateProgress();}
});
knownButton.addEventListener("click",()=>{
    if(!filtered.length)return;
    const item=filtered[index];
    itemState[item.id].solved=true;
    saveState();
    card.classList.remove("vocab-solved-flash");void card.offsetWidth;card.classList.add("vocab-solved-flash");
    window.setTimeout(()=>rebuildList(item.id),160);
});
learningButton.addEventListener("click",()=>{
    if(!filtered.length)return;
    const item=filtered[index];
    itemState[item.id].solved=false;
    saveState();
    card.classList.remove("vocab-learning-flash");void card.offsetWidth;card.classList.add("vocab-learning-flash");
    window.setTimeout(()=>rebuildList(item.id),160);
});
search.addEventListener("input",()=>rebuildList());
category.addEventListener("change",()=>rebuildList());
statusButtons.forEach(button=>button.addEventListener("click",()=>setStatusFilter(button.dataset.status||"all")));

function initialize(){
    statusButtons.forEach(button=>button.classList.toggle("active",button.dataset.status==="all"));
    rebuildList();
}
initialize();
