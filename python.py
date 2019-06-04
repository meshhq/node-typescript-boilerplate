The global keyword means that assignments will happen at the module's top level, not at the program's top level.
Other modules will still need the usual dotted access to variables within the module.

To summarize: in order to know whether a variable x is local to a function, you should read the entire function:
1. if you've found global x, then x is a global variable
2. If you've found nonlocal x, then x belongs to an enclosing function, and is neither local nor global
3. If you've found x = 5 or for x in range(3) or some other binding, then x is a local variable
4. Otherwise x belongs to some enclosing scope (function scope, global scope, or builtins)




