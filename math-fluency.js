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


const extraFormulas=[
/* Algebra — expanded recall set */
{id:"standard-slope",formula:"m=-\\frac{A}{B}",topic:"Slope from standard form",category:"Algebra",prompt:"For a line Ax + By = C with B ≠ 0, what is its slope m?",meaning:"Solve the standard-form equation for y; the coefficient of x is the slope.",symbols:"A and B are the x- and y-coefficients; B must be nonzero.",example:"For \\(6x+3y=12\\), \\(m=-6/3=-2\\).",note:"You do not need to fully rewrite the equation if you recognize the slope directly."},
{id:"standard-x-intercept",formula:"x=\\frac{C}{A}",topic:"x-intercept from standard form",category:"Algebra",prompt:"For Ax + By = C with A ≠ 0, what is the x-coordinate of the x-intercept?",meaning:"At the x-intercept, y=0, so Ax=C.",symbols:"A = x-coefficient; C = constant.",example:"For \\(4x+5y=20\\), the x-intercept has x-coordinate 5.",note:"The full intercept is \\((C/A,0)\\)."},
{id:"standard-y-intercept",formula:"y=\\frac{C}{B}",topic:"y-intercept from standard form",category:"Algebra",prompt:"For Ax + By = C with B ≠ 0, what is the y-coordinate of the y-intercept?",meaning:"At the y-intercept, x=0, so By=C.",symbols:"B = y-coefficient; C = constant.",example:"For \\(4x+5y=20\\), the y-intercept has y-coordinate 4.",note:"The full intercept is \\((0,C/B)\\)."},
{id:"horizontal-line",formula:"y=k",topic:"Horizontal lines",category:"Algebra",prompt:"A horizontal line passes through every point whose y-coordinate is k. What is its equation?",meaning:"Every point on a horizontal line has the same y-value.",symbols:"k = constant y-coordinate.",example:"A horizontal line through \\((3,7)\\) is \\(y=7\\).",note:"Every horizontal line has slope 0."},
{id:"vertical-line",formula:"x=k",topic:"Vertical lines",category:"Algebra",prompt:"A vertical line passes through every point whose x-coordinate is k. What is its equation?",meaning:"Every point on a vertical line has the same x-value.",symbols:"k = constant x-coordinate.",example:"A vertical line through \\((-2,5)\\) is \\(x=-2\\).",note:"A vertical line has undefined slope."},
{id:"arithmetic-explicit",formula:"a_n=a_1+(n-1)d",topic:"Arithmetic sequence explicit form",category:"Algebra",prompt:"An arithmetic sequence starts at a₁ and has common difference d. What is its nth term aₙ?",meaning:"An arithmetic sequence is a linear pattern: each step adds the same difference.",symbols:"a₁ = first term; d = common difference; n = term number.",example:"If \\(a_1=5\\) and \\(d=3\\), then \\(a_6=20\\).",note:"The factor is \\(n-1\\), because no step occurs before the first term."},
{id:"arithmetic-difference",formula:"d=a_{n+1}-a_n",topic:"Arithmetic sequence common difference",category:"Algebra",prompt:"Consecutive terms of an arithmetic sequence are aₙ and aₙ₊₁. How do you find the common difference d?",meaning:"Subtract any term from the term immediately after it.",symbols:"d = constant difference between consecutive terms.",example:"In 4, 9, 14, 19, the common difference is 5.",note:"A constant difference corresponds to a linear relationship."},
{id:"arithmetic-recursive",formula:"a_n=a_{n-1}+d",topic:"Arithmetic sequence recursive form",category:"Algebra",prompt:"How can an arithmetic sequence be written recursively using the previous term aₙ₋₁ and common difference d?",meaning:"Each new term equals the previous term plus the constant difference.",symbols:"aₙ = current term; aₙ₋₁ = previous term.",example:"If \\(a_1=2\\) and \\(d=4\\), then \\(a_n=a_{n-1}+4\\).",note:"A recursive rule also needs a starting value."},
{id:"line-two-points",formula:"y-y_1=\\frac{y_2-y_1}{x_2-x_1}(x-x_1)",topic:"Equation through two points",category:"Algebra",prompt:"A nonvertical line passes through (x₁,y₁) and (x₂,y₂). Write an equation of the line using those points.",meaning:"First compute the slope from the two points, then use point-slope form.",symbols:"The two x-coordinates must differ.",example:"Through \\((1,2)\\) and \\((3,8)\\): \\(y-2=3(x-1)\\).",note:"Either point can be used as the point-slope anchor."},
{id:"parallel-through-point",formula:"y-y_1=m(x-x_1)",topic:"Parallel line through a point",category:"Algebra",prompt:"A line must pass through (x₁,y₁) and be parallel to a line of slope m. What equation can you write immediately?",meaning:"Parallel lines share the same slope, so use that slope in point-slope form.",symbols:"m = slope of the given parallel line.",example:"Parallel to slope 2 through \\((4,1)\\): \\(y-1=2(x-4)\\).",note:"Do not change the sign or take a reciprocal for parallel lines."},
{id:"perpendicular-reciprocal",formula:"m_2=-\\frac{1}{m_1}",topic:"Perpendicular slope",category:"Algebra",prompt:"A nonvertical, nonhorizontal line has slope m₁. What is the slope m₂ of a perpendicular line?",meaning:"Perpendicular nonaxis-aligned lines have negative-reciprocal slopes.",symbols:"m₁ ≠ 0.",example:"If \\(m_1=-3/4\\), then \\(m_2=4/3\\).",note:"Flip the fraction and change the sign."},
{id:"system-equalize",formula:"m_1x+b_1=m_2x+b_2",topic:"Solving two y-form equations",category:"Algebra",prompt:"For the system y=m₁x+b₁ and y=m₂x+b₂, what single equation in x can be formed by substitution?",meaning:"At an intersection, both expressions equal the same y-value.",symbols:"m₁,m₂ = slopes; b₁,b₂ = intercepts.",example:"For \\(y=2x+1\\) and \\(y=-x+7\\), solve \\(2x+1=-x+7\\).",note:"This often gives the x-coordinate of the intersection in one step."},
{id:"elimination-opposites",formula:"(Ax+By)+(Cx-By)=(A+C)x",topic:"Elimination with opposite coefficients",category:"Algebra",prompt:"Two system equations contain +By and −By. What happens when the equations are added?",meaning:"Opposite y-terms cancel, leaving an equation in x only.",symbols:"A,B,C = coefficients.",example:"\\(2x+3y=10\\) plus \\(x-3y=2\\) gives \\(3x=12\\).",note:"You may multiply one equation first to create opposite coefficients."},
{id:"system-none",formula:"m_1=m_2,\\;b_1\\ne b_2",topic:"No solution in a linear system",category:"Algebra",prompt:"Two lines are y=m₁x+b₁ and y=m₂x+b₂. What slope/intercept condition makes the system have no solution?",meaning:"Equal slopes but different intercepts create distinct parallel lines.",symbols:"m₁,m₂ = slopes; b₁,b₂ = y-intercepts.",example:"\\(y=3x+1\\) and \\(y=3x-4\\) never intersect.",note:"Parallel distinct lines mean zero solutions."},
{id:"system-infinite",formula:"m_1=m_2,\\;b_1=b_2",topic:"Infinitely many solutions in a linear system",category:"Algebra",prompt:"Two lines are y=m₁x+b₁ and y=m₂x+b₂. What condition makes the system have infinitely many solutions?",meaning:"Matching slope and intercept means the equations represent the same line.",symbols:"m₁,m₂ = slopes; b₁,b₂ = y-intercepts.",example:"\\(y=2x+5\\) and \\(2y=4x+10\\) are the same line.",note:"Equivalent equations may look different before simplification."},
{id:"linear-inequality-positive",formula:"ax+b<c\\Rightarrow x<\\frac{c-b}{a}\\quad(a>0)",topic:"Linear inequality with positive coefficient",category:"Algebra",prompt:"If ax+b<c and a is positive, what inequality results after isolating x?",meaning:"With a positive divisor, the inequality direction stays the same.",symbols:"a > 0.",example:"\\(3x+2<11\\Rightarrow x<3\\).",note:"Only multiplying or dividing by a negative reverses the sign."},
{id:"two-variable-boundary",formula:"Ax+By=C",topic:"Boundary of a linear inequality",category:"Algebra",prompt:"For the inequality Ax+By≤C, what equation gives the boundary line that you graph first?",meaning:"Replace the inequality symbol with equality to obtain the boundary.",symbols:"A,B,C = constants.",example:"The boundary of \\(2x+y\\le6\\) is \\(2x+y=6\\).",note:"Use a solid boundary for ≤ or ≥ and a dashed boundary for < or >."},
{id:"linear-interpolation",formula:"y=y_1+\\frac{y_2-y_1}{x_2-x_1}(x-x_1)",topic:"Linear interpolation",category:"Algebra",prompt:"A linear relationship passes through (x₁,y₁) and (x₂,y₂). What expression gives y at another x-value?",meaning:"Move from a known y-value using slope times horizontal change.",symbols:"x₁ ≠ x₂.",example:"Between \\((0,10)\\) and \\((5,20)\\), at x=3 the formula gives y=16.",note:"This is point-slope form solved for y."},
{id:"slope-units",formula:"m=\\frac{\\text{change in output}}{\\text{change in input}}",topic:"Slope as a contextual rate",category:"Algebra",prompt:"In a linear model relating an output to an input, how is the slope m interpreted as a rate?",meaning:"Slope measures output change per one unit of input change.",symbols:"Units are output-units per input-unit.",example:"A slope of 12 dollars/hour means cost rises $12 for each hour.",note:"Always include units when interpreting slope in context."},
{id:"constant-function",formula:"f(x)=c",topic:"Constant function",category:"Algebra",prompt:"A function has the same output c for every input x. How is the function written?",meaning:"A constant function graphs as a horizontal line.",symbols:"c = fixed output.",example:"If every input maps to 7, then \\(f(x)=7\\).",note:"The slope of a constant function is 0."},
{id:"standard-to-slope",formula:"y=-\\frac{A}{B}x+\\frac{C}{B}",topic:"Convert standard to slope-intercept form",category:"Algebra",prompt:"Solve Ax+By=C for y, assuming B≠0.",meaning:"Move Ax to the other side and divide every term by B.",symbols:"A,B,C = constants.",example:"\\(2x+4y=12\\Rightarrow y=-\\frac12x+3\\).",note:"Dividing every term by B reveals both slope and y-intercept."},
{id:"solve-standard-for-x",formula:"x=\\frac{C-By}{A}",topic:"Solve a two-variable linear equation for x",category:"Algebra",prompt:"For Ax+By=C with A≠0, what expression gives x in terms of y?",meaning:"Subtract By and divide by A.",symbols:"A ≠ 0.",example:"\\(3x+2y=12\\Rightarrow x=(12-2y)/3\\).",note:"Keep the entire numerator over A."},
{id:"linear-change",formula:"\\Delta y=m\\Delta x",topic:"Change in a linear function",category:"Algebra",prompt:"For a linear function with slope m, how are a change Δx in input and the corresponding change Δy in output related?",meaning:"Constant slope means output change equals slope times input change.",symbols:"Δ means change.",example:"If m=4 and x increases by 3, y increases by 12.",note:"This relation is independent of the intercept."},
{id:"function-difference-slope",formula:"m=\\frac{f(b)-f(a)}{b-a}",topic:"Slope from function values",category:"Algebra",prompt:"A linear function f is evaluated at x=a and x=b. What formula gives its slope m?",meaning:"Use change in function output divided by change in input.",symbols:"a ≠ b.",example:"If \\(f(2)=7\\) and \\(f(5)=16\\), then \\(m=3\\).",note:"For a linear function, this value is the same for every pair of distinct inputs."},
{id:"break-even",formula:"R(x)=C(x)",topic:"Break-even point",category:"Algebra",prompt:"If R(x) is revenue and C(x) is cost, what equation determines the break-even input x?",meaning:"Break-even occurs when revenue exactly equals cost.",symbols:"R = revenue function; C = cost function.",example:"If \\(R=12x\\) and \\(C=100+7x\\), solve \\(12x=100+7x\\).",note:"The intersection point of the two models is the break-even point."},
{id:"linear-inverse-rate",formula:"\\frac{\\Delta x}{\\Delta y}=\\frac{1}{m}",topic:"Reciprocal rate",category:"Algebra",prompt:"If a nonzero linear rate is m=Δy/Δx, what is the reciprocal rate Δx/Δy?",meaning:"Reversing which quantity is measured per unit takes the reciprocal of the rate.",symbols:"m ≠ 0.",example:"60 miles/hour corresponds to \\(1/60\\) hour per mile.",note:"The units reverse along with the numerical rate."},

/* Advanced Math — expanded recall set */
{id:"binomial-product",formula:"(x+a)(x+b)=x^2+(a+b)x+ab",topic:"Product of two linear binomials",category:"Advanced Math",prompt:"Expand (x+a)(x+b).",meaning:"Multiply each term in one binomial by each term in the other and combine like terms.",symbols:"a,b = constants.",example:"\\((x+3)(x+5)=x^2+8x+15\\).",note:"The middle coefficient is the sum a+b; the constant is the product ab."},
{id:"conjugate-product",formula:"(a+b)(a-b)=a^2-b^2",topic:"Product of conjugates",category:"Advanced Math",prompt:"What does the product (a+b)(a−b) simplify to?",meaning:"The middle terms cancel, leaving a difference of squares.",symbols:"a,b = expressions.",example:"\\((x+4)(x-4)=x^2-16\\).",note:"Conjugates are especially useful for difference-of-squares structure."},
{id:"complete-square",formula:"x^2+bx=\\left(x+\\frac b2\\right)^2-\\left(\\frac b2\\right)^2",topic:"Completing the square",category:"Advanced Math",prompt:"Rewrite x²+bx by completing the square.",meaning:"Add and subtract the square of half the linear coefficient.",symbols:"b = coefficient of x.",example:"\\(x^2+6x=(x+3)^2-9\\).",note:"Half b first, then square it."},
{id:"vertex-y",formula:"y_{\\text{vertex}}=f\\!\\left(-\\frac{b}{2a}\\right)",topic:"Vertex y-coordinate",category:"Advanced Math",prompt:"For y=f(x)=ax²+bx+c, after finding x_vertex=−b/(2a), how do you find the vertex's y-coordinate?",meaning:"Evaluate the quadratic at the x-coordinate of the vertex.",symbols:"a ≠ 0.",example:"For \\(f(x)=x^2-4x+1\\), evaluate \\(f(2)=-3\\).",note:"The vertex is \\(( -b/(2a), f(-b/(2a)) )\\)."},
{id:"roots-axis",formula:"x_{\\text{axis}}=\\frac{r_1+r_2}{2}",topic:"Axis of symmetry from roots",category:"Advanced Math",prompt:"A quadratic has real roots r₁ and r₂. What is the x-coordinate of its axis of symmetry?",meaning:"The axis lies halfway between the two x-intercepts.",symbols:"r₁,r₂ = roots.",example:"Roots 2 and 8 give axis \\(x=5\\).",note:"This is the midpoint of the roots."},
{id:"disc-two",formula:"b^2-4ac>0",topic:"Two real quadratic solutions",category:"Advanced Math",prompt:"For ax²+bx+c=0, what discriminant condition guarantees two distinct real solutions?",meaning:"A positive discriminant produces two different real square-root values.",symbols:"a ≠ 0.",example:"If D=9, the quadratic has two distinct real roots.",note:"Positive discriminant means two real x-intercepts."},
{id:"disc-one",formula:"b^2-4ac=0",topic:"One repeated quadratic solution",category:"Advanced Math",prompt:"For ax²+bx+c=0, what discriminant condition gives exactly one repeated real solution?",meaning:"A zero discriminant makes the ± square-root term vanish.",symbols:"a ≠ 0.",example:"\\(x^2-6x+9=0\\) has D=0.",note:"The graph is tangent to the x-axis at the repeated root."},
{id:"disc-none",formula:"b^2-4ac<0",topic:"No real quadratic solutions",category:"Advanced Math",prompt:"For ax²+bx+c=0, what discriminant condition means there are no real solutions?",meaning:"A negative discriminant would require the square root of a negative number.",symbols:"a ≠ 0.",example:"\\(x^2+x+1=0\\) has D=-3.",note:"The graph does not cross the x-axis."},
{id:"repeated-root",formula:"x=-\\frac{b}{2a}",topic:"Repeated quadratic root",category:"Advanced Math",prompt:"If ax²+bx+c=0 has discriminant 0, what is its repeated root?",meaning:"With D=0, the quadratic formula reduces to a single value.",symbols:"a ≠ 0.",example:"For \\(x^2-8x+16=0\\), the repeated root is 4.",note:"The repeated root is also the vertex's x-coordinate."},
{id:"factor-theorem",formula:"f(c)=0\\Longleftrightarrow(x-c)\\text{ is a factor}",topic:"Factor theorem",category:"Advanced Math",prompt:"For a polynomial f(x), what condition on f(c) tells you that (x−c) is a factor?",meaning:"A polynomial factor corresponds directly to a zero of the function.",symbols:"c = candidate root.",example:"If \\(f(3)=0\\), then \\((x-3)\\) is a factor.",note:"The root is c while the factor is x−c."},
{id:"remainder-theorem",formula:"\\text{remainder}=f(c)",topic:"Remainder theorem",category:"Advanced Math",prompt:"When polynomial f(x) is divided by (x−c), what is the remainder?",meaning:"Substituting x=c gives the remainder directly.",symbols:"c = value from divisor x−c.",example:"If \\(f(2)=7\\), division by \\((x-2)\\) leaves remainder 7.",note:"A remainder of 0 means x−c is a factor."},
{id:"sum-cubes",formula:"a^3+b^3=(a+b)(a^2-ab+b^2)",topic:"Sum of cubes",category:"Advanced Math",prompt:"Factor a³+b³.",meaning:"A sum of cubes factors into a binomial times a quadratic.",symbols:"a,b = expressions.",example:"\\(x^3+8=(x+2)(x^2-2x+4)\\).",note:"The middle sign in the quadratic is opposite the sign in the binomial."},
{id:"difference-cubes",formula:"a^3-b^3=(a-b)(a^2+ab+b^2)",topic:"Difference of cubes",category:"Advanced Math",prompt:"Factor a³−b³.",meaning:"A difference of cubes factors into a binomial times a quadratic.",symbols:"a,b = expressions.",example:"\\(x^3-27=(x-3)(x^2+3x+9)\\).",note:"The quadratic has all positive terms for a difference of cubes."},
{id:"radical-product",formula:"\\sqrt a\\,\\sqrt b=\\sqrt{ab}",topic:"Product of radicals",category:"Advanced Math",prompt:"For nonnegative a and b, how can √a·√b be combined into one radical?",meaning:"Square roots multiply under one radical for nonnegative real radicands.",symbols:"a,b ≥ 0.",example:"\\(\\sqrt3\\sqrt{12}=\\sqrt{36}=6\\).",note:"Check real-number domain restrictions before applying radical rules."},
{id:"sqrt-square",formula:"\\sqrt{x^2}=|x|",topic:"Square root of a square",category:"Advanced Math",prompt:"For real x, what is √(x²)?",meaning:"The principal square root is always nonnegative.",symbols:"x = any real number.",example:"If x=-5, \\(\\sqrt{x^2}=5\\), not -5.",note:"The absolute value is essential."},
{id:"exp-y-intercept",formula:"f(0)=a",topic:"Exponential y-intercept",category:"Advanced Math",prompt:"For f(x)=abˣ, what is the y-intercept value f(0)?",meaning:"Any nonzero base raised to the zero power equals 1.",symbols:"a = initial value; b = base.",example:"For \\(f(x)=7(1.2)^x\\), \\(f(0)=7\\).",note:"In contextual models, a often represents the initial amount."},
{id:"exp-growth-factor",formula:"b=1+r",topic:"Exponential growth factor",category:"Advanced Math",prompt:"An exponential quantity grows by decimal rate r each period. What is its multiplicative growth factor b?",meaning:"A percent increase adds the rate to 1.",symbols:"r is written as a decimal.",example:"8% growth gives \\(b=1.08\\).",note:"Do not use 8 as the factor for an 8% rate."},
{id:"exp-rate-factor",formula:"r=b-1",topic:"Growth rate from exponential factor",category:"Advanced Math",prompt:"An exponential model has growth factor b>1. What decimal growth rate r does that represent?",meaning:"Subtract 1 from the multiplicative factor.",symbols:"b = per-period growth factor.",example:"\\(b=1.06\\) means \\(r=0.06=6\\%\\).",note:"Convert the decimal to a percent only after subtracting 1."},
{id:"exp-successive-ratio",formula:"\\frac{f(x+1)}{f(x)}=b",topic:"Successive ratio in an exponential function",category:"Advanced Math",prompt:"For f(x)=abˣ, what is the ratio f(x+1)/f(x)?",meaning:"Each one-unit increase in x multiplies the output by the constant base b.",symbols:"b = exponential growth or decay factor.",example:"For \\(f(x)=5(1.3)^x\\), consecutive outputs have ratio 1.3.",note:"Constant ratio signals an exponential pattern; constant difference signals a linear pattern."},
{id:"doubling-model",formula:"A=P\\,2^{t/d}",topic:"Exponential doubling time",category:"Advanced Math",prompt:"A quantity starts at P and doubles every d time units. What model gives its amount A after time t?",meaning:"Every d units of time contributes one factor of 2.",symbols:"d = doubling time.",example:"If P=10 and d=3, after t=6 the amount is 40.",note:"The exponent counts the number of doubling periods."},
{id:"half-life-model",formula:"A=P\\left(\\frac12\\right)^{t/h}",topic:"Exponential half-life",category:"Advanced Math",prompt:"A quantity starts at P and halves every h time units. What model gives its amount A after time t?",meaning:"Every h units of time multiplies the amount by one-half.",symbols:"h = half-life.",example:"If P=80 and h=4, after 8 units the amount is 20.",note:"The exponent counts the number of half-life periods."},
{id:"compound-interest",formula:"A=P\\left(1+\\frac rn\\right)^{nt}",topic:"Compound interest",category:"Advanced Math",prompt:"Principal P earns annual decimal rate r compounded n times per year. What is the balance A after t years?",meaning:"Each compounding period applies rate r/n, and there are nt periods.",symbols:"P = principal; r = annual rate; n = compounds per year; t = years.",example:"For monthly compounding, use n=12.",note:"This is a standard exponential-growth structure."},
{id:"inverse-variation",formula:"y=\\frac{k}{x}",topic:"Inverse variation",category:"Advanced Math",prompt:"If y varies inversely with x with constant k, how are y and x related?",meaning:"The product xy remains constant.",symbols:"k = constant of variation; x ≠ 0.",example:"If \\(xy=12\\), then \\(y=12/x\\).",note:"Inverse variation is nonlinear."},
{id:"rational-cross",formula:"\\frac{a}{b}=\\frac{c}{d}\\Rightarrow ad=bc",topic:"Cross-multiplying rational equations",category:"Advanced Math",prompt:"If a/b=c/d with b,d≠0, what equation results from cross multiplication?",meaning:"Multiply each numerator by the opposite denominator.",symbols:"b,d must be nonzero.",example:"\\(x/3=4/5\\Rightarrow5x=12\\).",note:"Denominator restrictions still matter after clearing fractions."},
{id:"quadratic-from-roots",formula:"y=a(x-r_1)(x-r_2)",topic:"Quadratic from roots",category:"Advanced Math",prompt:"A quadratic has roots r₁ and r₂ and leading coefficient a. What equation has exactly those roots?",meaning:"Each root becomes a linear factor that is zero at that x-value.",symbols:"a ≠ 0.",example:"Roots 2 and -3 with a=1 give \\(y=(x-2)(x+3)\\).",note:"A root r corresponds to factor x−r."},
{id:"horizontal-shift",formula:"g(x)=f(x-h)",topic:"Horizontal function shift",category:"Advanced Math",prompt:"What transformation of f(x) shifts its graph h units to the right?",meaning:"Subtracting h inside the input shifts the graph right.",symbols:"h>0 for a rightward shift.",example:"\\(g(x)=f(x-4)\\) shifts f right 4 units.",note:"Horizontal shifts use the opposite sign from the direction you might first expect."},

/* Problem-Solving and Data Analysis — expanded recall set */
{id:"speed-rate",formula:"r=\\frac{d}{t}",topic:"Speed or rate",category:"Problem-Solving and Data Analysis",prompt:"An object travels distance d in time t. What formula gives its average rate r?",meaning:"Rate is distance per unit time.",symbols:"d = distance; t = elapsed time.",example:"150 km in 3 hours gives 50 km/h.",note:"Keep distance and time units compatible."},
{id:"distance-rate-time",formula:"d=rt",topic:"Distance from rate and time",category:"Problem-Solving and Data Analysis",prompt:"An object moves at constant rate r for time t. What distance d does it travel?",meaning:"Distance equals rate multiplied by elapsed time.",symbols:"r = distance per unit time.",example:"60 mph for 2.5 hours gives 150 miles.",note:"Convert units before multiplying if necessary."},
{id:"density",formula:"\\rho=\\frac{m}{V}",topic:"Density",category:"Problem-Solving and Data Analysis",prompt:"A sample has mass m and volume V. What formula gives its density ρ?",meaning:"Density measures mass per unit volume.",symbols:"ρ = density; m = mass; V = volume.",example:"20 g in 5 cm³ gives 4 g/cm³.",note:"Density is a derived unit."},
{id:"conversion-factor",formula:"\\text{new quantity}=\\text{old quantity}\\times\\frac{\\text{desired unit}}{\\text{old unit}}",topic:"Unit conversion",category:"Problem-Solving and Data Analysis",prompt:"What multiplication structure converts a measured quantity from an old unit to a desired unit?",meaning:"Choose a conversion factor equal to 1 so the old unit cancels.",symbols:"The numerator and denominator represent equivalent amounts.",example:"\\(3\\text{ ft}\\times12\\text{ in}/1\\text{ ft}=36\\text{ in}\\).",note:"Track units algebraically; cancellation catches many mistakes."},
{id:"scale-drawing",formula:"\\text{actual length}=k(\\text{drawing length})",topic:"Scale drawings",category:"Problem-Solving and Data Analysis",prompt:"A drawing uses scale factor k from drawing length to actual length. How do you find the actual length?",meaning:"Multiply the drawing measurement by the linear scale factor.",symbols:"k = actual units per drawing unit.",example:"At 5 m per cm, 7 cm represents 35 m.",note:"Area would scale by k², not k."},
{id:"simple-interest",formula:"I=Prt",topic:"Simple interest",category:"Problem-Solving and Data Analysis",prompt:"Principal P earns simple annual interest rate r for t years. What formula gives the interest I earned?",meaning:"Simple interest is calculated only on the original principal.",symbols:"r is written as a decimal.",example:"$500 at 4% for 3 years earns \\(500(0.04)(3)=60\\).",note:"Simple interest differs from compounding."},
{id:"tax-tip-total",formula:"\\text{total}=\\text{base}(1+r)",topic:"Tax or tip added to a base amount",category:"Problem-Solving and Data Analysis",prompt:"A tax or tip at decimal rate r is added to a base amount. What formula gives the total?",meaning:"The total includes 100% of the base plus an additional r of the base.",symbols:"r = tax or tip rate as a decimal.",example:"A $40 meal with 20% tip totals $48.",note:"Use 1+r, not just r."},
{id:"discount-price",formula:"\\text{sale price}=\\text{original}(1-r)",topic:"Discounted price",category:"Problem-Solving and Data Analysis",prompt:"An item with original price P is discounted by decimal rate r. What is its sale price?",meaning:"A discount leaves the fraction 1−r of the original price.",symbols:"r = discount rate.",example:"25% off $80 gives \\(80(0.75)=60\\).",note:"The discount amount is Pr; the final price is P(1−r)."},
{id:"markup-price",formula:"\\text{new price}=\\text{original}(1+r)",topic:"Markup",category:"Problem-Solving and Data Analysis",prompt:"A price is increased by decimal markup rate r. What formula gives the new price?",meaning:"A markup retains the original 100% and adds r more.",symbols:"r = markup rate.",example:"A 30% markup on $50 gives $65.",note:"A later equal-percent discount does not generally undo the markup."},
{id:"successive-percent",formula:"\\text{final}=\\text{initial}(1+r_1)(1+r_2)",topic:"Successive percent changes",category:"Problem-Solving and Data Analysis",prompt:"A quantity changes successively by decimal rates r₁ and r₂. How is the final value found from the initial value?",meaning:"Successive percentage changes multiply their factors rather than add their rates.",symbols:"Use a negative r for a decrease, or write 1−r explicitly.",example:"+10% then +20% gives factor \\(1.1\\times1.2=1.32\\).",note:"The net change here is 32%, not 30%."},
{id:"percentage-points",formula:"\\text{percentage-point change}=p_2-p_1",topic:"Percentage-point change",category:"Problem-Solving and Data Analysis",prompt:"A rate changes from p₁% to p₂%. How many percentage points did it change?",meaning:"Percentage-point change is the direct subtraction of percentages.",symbols:"p₁,p₂ are percentage values.",example:"From 40% to 55% is a 15-percentage-point increase.",note:"Percentage points are different from percent change."},
{id:"sum-from-mean",formula:"\\sum x_i=n\\bar{x}",topic:"Recovering a sum from the mean",category:"Problem-Solving and Data Analysis",prompt:"A data set has n values with mean x̄. What is the sum of all observations?",meaning:"Mean equals sum divided by count, so sum equals count times mean.",symbols:"n = number of observations.",example:"8 values with mean 12 have total 96.",note:"This is useful when a value is added or removed."},
{id:"updated-mean",formula:"\\bar{x}_{new}=\\frac{n\\bar{x}+x}{n+1}",topic:"Mean after adding one value",category:"Problem-Solving and Data Analysis",prompt:"A set of n values has mean x̄. After adding one value x, what is the new mean?",meaning:"Recover the old total, add the new value, and divide by the new count.",symbols:"n = old count.",example:"4 values average 10; add 20: new mean is \\(60/5=12\\).",note:"Do not simply average the old mean and the new value."},
{id:"combined-mean",formula:"\\bar{x}=\\frac{n_1\\bar{x}_1+n_2\\bar{x}_2}{n_1+n_2}",topic:"Combined mean of two groups",category:"Problem-Solving and Data Analysis",prompt:"Groups of sizes n₁ and n₂ have means x̄₁ and x̄₂. What is the mean of the combined group?",meaning:"Weight each group mean by its group size.",symbols:"n₁,n₂ = group counts.",example:"10 students average 80 and 20 average 90 gives combined mean \\(2600/30\\).",note:"A simple average of the two means works only when group sizes are equal."},
{id:"sample-proportion",formula:"\\hat p=\\frac{x}{n}",topic:"Sample proportion",category:"Problem-Solving and Data Analysis",prompt:"In a sample of n observations, x have a specified characteristic. What is the sample proportion p̂?",meaning:"A sample proportion is the count with the characteristic divided by total sample size.",symbols:"x = successes; n = sample size.",example:"42 of 120 gives \\(\\hat p=0.35\\).",note:"Keep proportions as decimals unless a percent is requested."},
{id:"expected-count",formula:"\\text{expected count}=np",topic:"Expected count from a proportion",category:"Problem-Solving and Data Analysis",prompt:"If proportion p of a group of size n is expected to have a characteristic, what count is expected?",meaning:"Multiply total size by the relevant proportion.",symbols:"p is a decimal probability or proportion.",example:"If 30% of 250 qualify, expected count is 75.",note:"The result may be interpreted as an estimate rather than an exact count."},
{id:"mutually-exclusive",formula:"P(A\\cup B)=P(A)+P(B)",topic:"Mutually exclusive events",category:"Problem-Solving and Data Analysis",prompt:"Events A and B cannot occur together. What is P(A or B)?",meaning:"When there is no overlap, no intersection probability needs to be subtracted.",symbols:"A∩B is empty.",example:"On one die roll, rolling 1 or 6 has probability \\(1/6+1/6=1/3\\).",note:"This shortcut applies only when the events are mutually exclusive."},
{id:"independent-intersection",formula:"P(A\\cap B)=P(A)P(B)",topic:"Independent events",category:"Problem-Solving and Data Analysis",prompt:"Events A and B are independent. What is the probability that both occur?",meaning:"Independence lets you multiply the individual probabilities.",symbols:"A∩B means both A and B.",example:"Two fair coin heads: \\((1/2)(1/2)=1/4\\).",note:"Do not use this multiplication rule merely because two events are different."},
{id:"joint-relative-frequency",formula:"\\text{joint relative frequency}=\\frac{\\text{cell count}}{\\text{grand total}}",topic:"Joint relative frequency",category:"Problem-Solving and Data Analysis",prompt:"In a two-way table, how is the joint relative frequency of one cell calculated?",meaning:"Divide the count in the intersection cell by the total number of observations.",symbols:"Grand total = total sample size.",example:"18 students in a cell out of 120 total gives 0.15.",note:"Joint relative frequency uses the grand total, not a row or column total."},
{id:"conditional-table",formula:"P(A\\mid B)=\\frac{\\text{count in }A\\cap B}{\\text{count in }B}",topic:"Conditional probability from a table",category:"Problem-Solving and Data Analysis",prompt:"In a two-way table, how do you compute P(A|B) from counts?",meaning:"Restrict attention to the B group, then find the fraction also in A.",symbols:"The denominator is the B row or column total.",example:"If 12 of 30 B-cases are also A, \\(P(A|B)=0.4\\).",note:"Conditional probability changes the relevant denominator."},
{id:"correlation-range",formula:"-1\\le r\\le1",topic:"Correlation coefficient range",category:"Problem-Solving and Data Analysis",prompt:"What numerical range can a correlation coefficient r take?",meaning:"Correlation ranges from perfect negative linear association to perfect positive linear association.",symbols:"r = linear correlation coefficient.",example:"r near 1 indicates strong positive linear association.",note:"Correlation describes linear association, not causation."},
{id:"positive-residual",formula:"y-\\hat y>0",topic:"Positive residual",category:"Problem-Solving and Data Analysis",prompt:"If an observed y-value lies above its model prediction ŷ, what inequality does its residual satisfy?",meaning:"Observed minus predicted is positive when the point lies above the model.",symbols:"residual = y−ŷ.",example:"Observed 14 and predicted 11 gives residual +3.",note:"A positive residual means the model underpredicted that observation."},
{id:"negative-residual",formula:"y-\\hat y<0",topic:"Negative residual",category:"Problem-Solving and Data Analysis",prompt:"If an observed y-value lies below its model prediction ŷ, what inequality does its residual satisfy?",meaning:"Observed minus predicted is negative when the point lies below the model.",symbols:"residual = y−ŷ.",example:"Observed 8 and predicted 10 gives residual -2.",note:"A negative residual means the model overpredicted that observation."},
{id:"best-fit-prediction",formula:"\\hat y=mx+b",topic:"Prediction from a linear model",category:"Problem-Solving and Data Analysis",prompt:"A line of best fit is ŷ=mx+b. How do you predict y for a given x?",meaning:"Substitute the x-value into the fitted linear equation.",symbols:"ŷ = predicted response.",example:"If \\(\\hat y=3x+2\\), then at x=4 the prediction is 14.",note:"A prediction is not necessarily an observed data value."},
{id:"moe-interval",formula:"[\\hat\\theta-E,\\;\\hat\\theta+E]",topic:"Interval from margin of error",category:"Problem-Solving and Data Analysis",prompt:"An estimate θ̂ has margin of error E. What interval is formed around the estimate?",meaning:"Subtract and add the margin of error from the point estimate.",symbols:"θ̂ = estimate; E = margin of error.",example:"52% ± 4% gives 48% to 56%.",note:"Use the same units for the estimate and margin of error."},
{id:"larger-sample-moe",formula:"n\\uparrow\\;\\Rightarrow\\;\\text{margin of error}\\downarrow",topic:"Sample size and margin of error",category:"Problem-Solving and Data Analysis",prompt:"All else equal, what generally happens to margin of error when sample size n increases?",meaning:"Larger random samples generally produce more precise estimates.",symbols:"n = sample size.",example:"A survey of 2,000 people generally has a smaller margin of error than a similar survey of 200.",note:"A larger sample does not fix biased sampling."},
{id:"population-mean-estimate",formula:"\\mu\\approx\\bar{x}",topic:"Estimating a population mean",category:"Problem-Solving and Data Analysis",prompt:"A representative random sample has mean x̄. Which population parameter is x̄ used to estimate?",meaning:"The sample mean estimates the population mean.",symbols:"μ = population mean; x̄ = sample mean.",example:"A random sample's average height is used to estimate the population's average height.",note:"Random sampling supports generalization to the sampled population."},

/* Geometry and Trigonometry — expanded recall set */
{id:"square-perimeter",formula:"P=4s",topic:"Perimeter of a square",category:"Geometry and Trigonometry",prompt:"What is the perimeter P of a square with side length s?",meaning:"A square has four equal sides.",symbols:"s = side length.",example:"If s=7, P=28.",note:"Perimeter uses linear units."},
{id:"parallelogram-area",formula:"A=bh",topic:"Area of a parallelogram",category:"Geometry and Trigonometry",prompt:"What is the area A of a parallelogram with base b and perpendicular height h?",meaning:"Area equals base times perpendicular height.",symbols:"h must be perpendicular to the base.",example:"Base 9 and height 4 gives area 36.",note:"Do not use a slanted side as the height unless it is perpendicular."},
{id:"prism-volume-general",formula:"V=Bh",topic:"Volume of a prism",category:"Geometry and Trigonometry",prompt:"A prism has base area B and perpendicular height h. What is its volume V?",meaning:"Every prism has volume equal to base area times height.",symbols:"B = area of one base.",example:"Base area 24 and height 7 gives volume 168.",note:"This includes rectangular and triangular prisms."},
{id:"cylinder-lateral",formula:"L=2\\pi rh",topic:"Lateral area of a cylinder",category:"Geometry and Trigonometry",prompt:"What is the lateral surface area L of a cylinder with radius r and height h, excluding both circular bases?",meaning:"Unwrapping the curved surface makes a rectangle with width circumference 2πr and height h.",symbols:"r = radius; h = height.",example:"r=3, h=5 gives \\(30\\pi\\).",note:"For total surface area, add the two circular bases."},
{id:"square-diagonal",formula:"d=s\\sqrt2",topic:"Diagonal of a square",category:"Geometry and Trigonometry",prompt:"A square has side length s. What is the length d of a diagonal?",meaning:"The diagonal is the hypotenuse of a 45°-45°-90° triangle.",symbols:"s = side length.",example:"If s=6, d=\\(6\\sqrt2\\).",note:"This follows directly from the Pythagorean theorem."},
{id:"equilateral-height",formula:"h=\\frac{\\sqrt3}{2}s",topic:"Height of an equilateral triangle",category:"Geometry and Trigonometry",prompt:"An equilateral triangle has side length s. What is its altitude h?",meaning:"The altitude splits the triangle into two 30°-60°-90° triangles.",symbols:"s = side length.",example:"If s=10, h=\\(5\\sqrt3\\).",note:"The altitude also bisects the base."},
{id:"equilateral-area",formula:"A=\\frac{\\sqrt3}{4}s^2",topic:"Area of an equilateral triangle",category:"Geometry and Trigonometry",prompt:"What is the area A of an equilateral triangle with side length s?",meaning:"Use one-half base times the equilateral-triangle altitude.",symbols:"s = side length.",example:"If s=4, area is \\(4\\sqrt3\\).",note:"This is a shortcut derived from A=bh/2."},
{id:"complementary-angles",formula:"A+B=90^\\circ",topic:"Complementary angles",category:"Geometry and Trigonometry",prompt:"Two angles A and B are complementary. What equation relates their measures?",meaning:"Complementary angles sum to a right angle.",symbols:"A,B = angle measures.",example:"If A=37°, then B=53°.",note:"Complementary means 90°, not 180°."},
{id:"supplementary-angles",formula:"A+B=180^\\circ",topic:"Supplementary angles",category:"Geometry and Trigonometry",prompt:"Two angles A and B are supplementary. What equation relates their measures?",meaning:"Supplementary angles sum to a straight angle.",symbols:"A,B = angle measures.",example:"If A=122°, then B=58°.",note:"A linear pair is supplementary."},
{id:"vertical-angles",formula:"m\\angle1=m\\angle3",topic:"Vertical angles",category:"Geometry and Trigonometry",prompt:"Two lines intersect, creating opposite vertical angles ∠1 and ∠3. How do their measures compare?",meaning:"Opposite angles formed by intersecting lines are congruent.",symbols:"∠1 and ∠3 are opposite, not adjacent.",example:"If one vertical angle is 68°, the opposite angle is also 68°.",note:"Adjacent angles instead form supplementary pairs."},
{id:"corresponding-angles",formula:"m\\angle1=m\\angle2",topic:"Corresponding angles with parallel lines",category:"Geometry and Trigonometry",prompt:"A transversal crosses two parallel lines. How are a pair of corresponding angles related?",meaning:"Corresponding angles formed by a transversal of parallel lines are congruent.",symbols:"The two main lines must be parallel.",example:"A 115° corresponding angle matches another 115° angle.",note:"Check that the angles occupy matching relative positions."},
{id:"alternate-interior",formula:"m\\angle1=m\\angle2",topic:"Alternate interior angles",category:"Geometry and Trigonometry",prompt:"A transversal crosses two parallel lines. How are alternate interior angles related?",meaning:"Alternate interior angles are congruent when the lines are parallel.",symbols:"Angles lie between the parallel lines on opposite sides of the transversal.",example:"If one is 72°, the alternate interior angle is 72°.",note:"This equality depends on the lines being parallel."},
{id:"same-side-interior",formula:"m\\angle1+m\\angle2=180^\\circ",topic:"Same-side interior angles",category:"Geometry and Trigonometry",prompt:"A transversal crosses two parallel lines. What is the sum of same-side interior angles?",meaning:"Same-side interior angles are supplementary.",symbols:"The angles lie between the parallel lines on the same side of the transversal.",example:"If one is 110°, the other is 70°.",note:"These are also called consecutive interior angles."},
{id:"isosceles-base",formula:"AB=AC\\Rightarrow\\angle B=\\angle C",topic:"Isosceles triangle base angles",category:"Geometry and Trigonometry",prompt:"In triangle ABC, AB=AC. What relationship must hold between angles B and C?",meaning:"Equal sides in a triangle lie opposite equal angles.",symbols:"AB and AC are the equal legs.",example:"If ∠B=48°, then ∠C=48°.",note:"The converse is also true: equal angles imply opposite equal sides."},
{id:"equilateral-angles",formula:"A=B=C=60^\\circ",topic:"Equilateral triangle angles",category:"Geometry and Trigonometry",prompt:"What are the three interior angle measures of an equilateral triangle?",meaning:"All sides are equal, so all angles are equal; the triangle sum is 180°.",symbols:"A,B,C = interior angles.",example:"Every equilateral triangle has three 60° angles.",note:"Equilateral triangles are also equiangular."},
{id:"exterior-sum",formula:"\\sum E_i=360^\\circ",topic:"Exterior-angle sum of a polygon",category:"Geometry and Trigonometry",prompt:"Taking one exterior angle at each vertex of any convex polygon, what is their total sum?",meaning:"Walking around the polygon makes one full turn.",symbols:"Eᵢ = exterior angles.",example:"The exterior angles of a pentagon still total 360°.",note:"This total does not depend on the number of sides."},
{id:"regular-interior",formula:"I=\\frac{(n-2)180^\\circ}{n}",topic:"Interior angle of a regular polygon",category:"Geometry and Trigonometry",prompt:"What is each interior angle I of a regular n-gon?",meaning:"Divide the total interior-angle sum evenly among n congruent angles.",symbols:"n = number of sides.",example:"A regular hexagon has each interior angle 120°.",note:"Equivalent shortcut: I=180°−360°/n."},
{id:"semicircle-angle",formula:"m\\angle APB=90^\\circ",topic:"Angle subtended by a diameter",category:"Geometry and Trigonometry",prompt:"AB is a diameter of a circle and P is another point on the circle. What is ∠APB?",meaning:"An inscribed angle intercepting a semicircle is a right angle.",symbols:"AB passes through the center.",example:"Any triangle inscribed with AB as diameter is right at P.",note:"This is a direct consequence of the inscribed-angle theorem."},
{id:"tangent-lengths",formula:"PA=PB",topic:"Tangent segments from one external point",category:"Geometry and Trigonometry",prompt:"From external point P, tangents touch a circle at A and B. How are tangent lengths PA and PB related?",meaning:"Tangent segments drawn from the same external point are congruent.",symbols:"A,B = tangency points.",example:"If PA=9, then PB=9.",note:"Both segments must originate from the same external point."},
{id:"unit-circle-coordinates",formula:"(x,y)=(\\cos\\theta,\\sin\\theta)",topic:"Unit circle coordinates",category:"Geometry and Trigonometry",prompt:"A point on the unit circle corresponds to angle θ from the positive x-axis. What are its coordinates?",meaning:"On the unit circle, cosine is the x-coordinate and sine is the y-coordinate.",symbols:"Unit circle radius = 1.",example:"At 0°, the point is (1,0).",note:"This connects circle geometry directly to trigonometric values."},
{id:"pythagorean-identity",formula:"\\sin^2\\theta+\\cos^2\\theta=1",topic:"Pythagorean trigonometric identity",category:"Geometry and Trigonometry",prompt:"What identity relates sin θ and cos θ for the same angle?",meaning:"It follows from x²+y²=1 on the unit circle.",symbols:"θ = angle.",example:"If \\(\\sin\\theta=3/5\\) and θ is acute, then \\(\\cos\\theta=4/5\\).",note:"The squares—not the unsquared values—sum to 1."},
{id:"full-circle-radians",formula:"360^\\circ=2\\pi\\text{ radians}",topic:"Full turn in radians",category:"Geometry and Trigonometry",prompt:"How many radians are in one full 360° rotation?",meaning:"A full turn is twice the half-turn equivalence 180°=π radians.",symbols:"π radians = 180°.",example:"90° is \\(\\pi/2\\) radians.",note:"Use this equivalence when converting angle units."},
{id:"arc-fraction",formula:"\\frac{\\text{arc measure}}{360^\\circ}=\\frac{\\theta}{360^\\circ}",topic:"Central angle as a fraction of a circle",category:"Geometry and Trigonometry",prompt:"A central angle has measure θ degrees. What fraction of the full circle does its intercepted arc represent?",meaning:"The central angle determines the same fraction of the circle's total 360°.",symbols:"θ = central angle in degrees.",example:"A 90° central angle corresponds to one quarter of the circle.",note:"Use that fraction with circumference for arc length or area for sector area."},
{id:"radius-bisects-chord",formula:"OM\\perp AB\\Rightarrow AM=MB",topic:"Perpendicular radius and chord",category:"Geometry and Trigonometry",prompt:"In a circle centered at O, radius segment OM is perpendicular to chord AB at M. What relationship holds between AM and MB?",meaning:"A radius perpendicular to a chord bisects the chord.",symbols:"M is the perpendicular intersection point.",example:"If AB=14, then AM=MB=7.",note:"The converse is also useful: a radius through a chord's midpoint is perpendicular to the chord."},
{id:"similar-side-proportion",formula:"\\frac{AB}{DE}=\\frac{BC}{EF}=\\frac{AC}{DF}",topic:"Corresponding sides of similar triangles",category:"Geometry and Trigonometry",prompt:"Triangles ABC and DEF are similar with A↔D, B↔E, C↔F. How are corresponding side lengths related?",meaning:"All corresponding side ratios in similar triangles are equal.",symbols:"Match vertices in the stated correspondence.",example:"If AB/DE=2, then every corresponding side ratio equals 2.",note:"Write ratios in a consistent triangle order."},
{id:"aa-similarity",formula:"\\angle A=\\angle D,\\;\\angle B=\\angle E\\Rightarrow\\triangle ABC\\sim\\triangle DEF",topic:"AA triangle similarity",category:"Geometry and Trigonometry",prompt:"If two angles of triangle ABC equal two corresponding angles of triangle DEF, what conclusion follows?",meaning:"Two matching angles are sufficient to establish triangle similarity.",symbols:"AA = angle-angle similarity.",example:"If ∠A=∠D and ∠B=∠E, the third angles also match.",note:"Similarity preserves angles and scales all corresponding lengths by one factor."}
];
formulas.push(...extraFormulas);

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
"slope-intercept":"A line has slope m and y-intercept b. Write its equation in slope-intercept form.",
"slope-two-points":"A line passes through (x₁, y₁) and (x₂, y₂). What formula gives its slope m?",
"point-slope":"A line has slope m and passes through (x₁, y₁). Write its equation in point-slope form.",
"standard-linear":"Write the standard form of a linear equation in x and y using constants A, B, and C.",
"linear-solve":"If ax + b = c and a ≠ 0, what expression gives x?",
"direct-variation":"If y varies directly with x and k is the constant of proportionality, write the equation relating y and x.",
"linear-model":"A quantity starts at an initial value and changes by a constant rate for each unit of input. Write the general linear model.",
"x-intercept":"When finding the x-intercept of an equation, what value must y equal?",
"y-intercept":"When finding the y-intercept of an equation, what value must x equal?",
"parallel-lines":"Two distinct nonvertical lines are parallel. What relationship must their slopes m₁ and m₂ satisfy?",
"perpendicular-lines":"Two nonvertical lines are perpendicular. What equation relates their slopes m₁ and m₂?",
"average-rate":"A function changes from (x₁, y₁) to (x₂, y₂). What formula gives its average rate of change?",
"system-intersection":"Two lines are y = m₁x + b₁ and y = m₂x + b₂. How are these equations written together as a system?",
"system-count":"Two lines have different slopes, m₁ ≠ m₂. How many intersection points—and therefore system solutions—must they have?",
"inequality-flip":"If a < b and c is negative, what inequality results after multiplying both sides by c?",
"compound-inequality":"x is greater than a and less than b. Write this as one compound inequality.",
"distributive":"Expand a(b + c) using the distributive property.",
"difference-squares":"Factor the difference of squares a² − b².",
"perfect-square-plus":"Factor a² + 2ab + b² as a squared binomial.",
"perfect-square-minus":"Factor a² − 2ab + b² as a squared binomial.",
"exp-product":"When multiplying aᵐ by aⁿ, what power of a results?",
"exp-quotient":"When dividing aᵐ by aⁿ for a ≠ 0, what power of a results?",
"power-power":"When (aᵐ) is raised to the nth power, what exponent does a have?",
"power-product":"When the product ab is raised to the nth power, how can the exponent be distributed?",
"zero-exponent":"For nonzero a, what is a⁰ equal to?",
"negative-exponent":"For nonzero a, rewrite a⁻ⁿ using only a positive exponent.",
"rational-exponent":"Rewrite a^(m/n) using radical notation.",
"quadratic-standard":"Write a quadratic equation with coefficients a, b, and c in standard form equal to zero.",
"quadratic-formula":"For ax² + bx + c = 0, what formula gives the possible values of x?",
"discriminant":"For ax² + bx + c = 0, what expression is the discriminant D?",
"vertex-x":"For y = ax² + bx + c, what formula gives the x-coordinate of the vertex?",
"vertex-form":"A parabola has vertex (h, k) and vertical scale factor a. Write its equation in vertex form.",
"factored-quadratic":"A quadratic has roots r₁ and r₂ and leading coefficient a. Write it in factored form.",
"root-sum":"For ax² + bx + c = 0 with roots r₁ and r₂, what is r₁ + r₂?",
"root-product":"For ax² + bx + c = 0 with roots r₁ and r₂, what is r₁r₂?",
"exponential-basic":"An exponential function has initial value a and growth factor b per unit x. Write its general equation.",
"exponential-growth":"A quantity starts at P and grows by decimal rate r each period. What is its value A after t periods?",
"exponential-decay":"A quantity starts at P and decreases by decimal rate r each period. What is its value A after t periods?",
"function-value":"If a is the input to a function f, how is the corresponding output written in function notation?",
"function-shift":"Starting from y = f(x), what equation shifts the graph right h units and up k units?",
"absolute-value":"If |x − h| = k with k ≥ 0, what are the two possible values of x?",
"rational-domain":"For a rational expression, what condition must every allowed input satisfy regarding the denominator?",
"ratio":"Express the ratio a:b as a fraction.",
"proportion":"If a/b = c/d, what cross-product equation follows?",
"unit-rate":"A quantity of output is produced from a quantity of input. How is the unit rate calculated?",
"percent":"A part is compared with a whole. What formula gives the percent?",
"percent-change":"A value changes from original to new. What formula gives the percent change?",
"percent-multiplier":"A value changes by decimal rate r. Write the multiplier form for finding the new value from the original value.",
"reverse-percent":"A new value resulted from an increase or decrease by decimal rate r. How can the original value be recovered?",
"mean":"For n observations x₁, x₂, …, xₙ, what formula gives the arithmetic mean x̄?",
"weighted-mean":"Values xᵢ have weights wᵢ. What formula gives their weighted mean?",
"range":"Given a data set's maximum and minimum values, how is the range calculated?",
"iqr":"If Q₁ and Q₃ are the first and third quartiles, how is the interquartile range calculated?",
"probability":"For equally likely outcomes, how is P(A) calculated from favorable and total outcomes?",
"complement":"If P(A) is known, what formula gives P(Aᶜ), the probability that A does not occur?",
"conditional-probability":"What formula gives P(A | B) in terms of P(A ∩ B) and P(B)?",
"addition-probability":"What formula gives P(A ∪ B), the probability that A or B occurs?",
"relative-frequency":"A category occurs a certain number of times within a relevant total. How is its relative frequency calculated?",
"residual":"A model predicts ŷ for an observed value y. How is the residual calculated?",
"sample-estimate":"A representative random sample produces a sample statistic. What population quantity is that statistic used to approximate?",
"margin-error":"An estimate has a stated margin of error. How is the corresponding interval written?",
"rectangle-area":"What is the area of a rectangle with length ℓ and width w?",
"rectangle-perimeter":"What is the perimeter of a rectangle with length ℓ and width w?",
"square-area":"What is the area of a square with side length s?",
"triangle-area":"What is the area of a triangle with base b and perpendicular height h?",
"trapezoid-area":"What is the area of a trapezoid with parallel bases b₁ and b₂ and height h?",
"circle-circumference":"What is the circumference C of a circle with radius r or diameter d?",
"circle-area":"What is the area A of a circle with radius r?",
"diameter-radius":"How are a circle's diameter d and radius r related?",
"arc-length-deg":"A circle has radius r and central angle θ measured in degrees. What formula gives the intercepted arc length L?",
"arc-length-rad":"A circle has radius r and central angle θ measured in radians. What formula gives arc length L?",
"sector-area-deg":"A sector has radius r and central angle θ measured in degrees. What formula gives its area?",
"sector-area-rad":"A sector has radius r and central angle θ measured in radians. What formula gives its area?",
"circle-equation":"A circle has center (h, k) and radius r. Write its equation in the coordinate plane.",
"central-angle":"A central angle ∠AOB intercepts arc AB. How do their degree measures compare?",
"inscribed-angle":"An inscribed angle ∠APB intercepts arc AB. How is the angle measure related to the intercepted arc measure?",
"tangent-radius":"A tangent touches a circle at T, and O is the center. What is the angle relationship between radius OT and the tangent?",
"pythagorean":"In a right triangle with legs a and b and hypotenuse c, what equation relates the three side lengths?",
"distance":"What formula gives the distance d between (x₁, y₁) and (x₂, y₂)?",
"midpoint":"What formula gives the midpoint M of endpoints (x₁, y₁) and (x₂, y₂)?",
"45-45-90":"In a 45°-45°-90° triangle, if each leg has length x, what are the three side lengths in ratio form?",
"30-60-90":"In a 30°-60°-90° triangle, if the short leg is x, what are the short leg, long leg, and hypotenuse?",
"sine":"Relative to angle θ in a right triangle, what ratio defines sin θ?",
"cosine":"Relative to angle θ in a right triangle, what ratio defines cos θ?",
"tangent":"Relative to angle θ in a right triangle, what ratio defines tan θ?",
"tan-sin-cos":"How can tan θ be written using sin θ and cos θ?",
"complementary-trig":"For an acute angle θ, how is sin θ related to the cosine of its complementary angle?",
"degree-radian":"What equality connects 180 degrees and radians?",
"triangle-sum":"What equation expresses the sum of the three interior angles A, B, and C of a triangle?",
"exterior-triangle":"A triangle has an exterior angle and two remote interior angles. What equation relates their measures?",
"polygon-sum":"What formula gives the sum S of the interior angles of an n-sided polygon?",
"regular-exterior":"What is the measure E of each exterior angle of a regular n-gon?",
"similarity":"Two similar figures have linear scale factor k. How can ratios of corresponding side lengths be written?",
"scale-area":"Two similar figures have linear scale factor k. What is the ratio of their areas A₂/A₁?",
"scale-volume":"Two similar solids have linear scale factor k. What is the ratio of their volumes V₂/V₁?",
"rect-prism-volume":"What is the volume V of a rectangular prism with length ℓ, width w, and height h?",
"rect-prism-sa":"What is the surface area SA of a closed rectangular prism with length ℓ, width w, and height h?",
"prism-diagonal":"What is the space diagonal d of a rectangular prism with dimensions ℓ, w, and h?",
"cylinder-volume":"What is the volume V of a cylinder with radius r and height h?",
"cylinder-sa":"What is the total surface area SA of a closed cylinder with radius r and height h?",
"sphere-volume":"What is the volume V of a sphere with radius r?",
"sphere-area":"What is the surface area SA of a sphere with radius r?",
"cone-volume":"What is the volume V of a cone with radius r and perpendicular height h?",
"pyramid-volume":"What is the volume V of a pyramid with base area B and perpendicular height h?"
};

function promptFor(item){
  return item.prompt||PROMPTS[item.id]||item.topic;
}

function iconFor(item){
  const id=item.id;
  let file="sigma.svg";
  if(/cylinder/.test(id)) file="cylinder.svg";
  else if(/circle|arc|sector|tangent-radius|sphere/.test(id)) file="circle.svg";
  else if(/triangle|pythagorean|sine|cosine|tangent|trig/.test(id)) file="triangle.svg";
  else if(/percent/.test(id)) file="percent.svg";
  else if(/probability|mean|range|residual|sample|margin|ratio|proportion|frequency|unit-rate/.test(id)) file="chart-no-axes-column-increasing.svg";
  else if(/rect-prism|prism|pyramid|cone|scale-volume/.test(id)) file="box.svg";
  else if(/radical|quadratic|vertex|discriminant|root|exp-|power-|zero-exponent|negative-exponent|rational-exponent/.test(id)) file="radical.svg";
  return "/assets/formula-icons/"+file;
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
    return [item.formula,item.topic,item.category,item.prompt,item.meaning,item.symbols,item.example,item.note]
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
function typeset(nodes,attempt=0){
    if(window.MathJax&&MathJax.typesetPromise){
        try{MathJax.typesetClear(nodes);}catch(e){}
        MathJax.typesetPromise(nodes).catch(()=>{});
        return;
    }
    if(attempt<40){
        window.setTimeout(()=>typeset(nodes,attempt+1),50);
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
    iconEl.innerHTML='<img src="'+iconFor(item)+'" alt="" draggable="false">';
    expressionEl.textContent="\\["+item.formula+"\\]";
    meaningEl.textContent=item.meaning;
    symbolsEl.textContent=item.symbols||"";
    exampleEl.textContent=item.example||"";
    noteEl.textContent=item.note||"";
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
