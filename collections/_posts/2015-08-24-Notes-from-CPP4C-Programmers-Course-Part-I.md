---
layout: post
title: Notes from CPP4C Programmers Course - Part I
tags: c++,c,programming
---

Not until a few months ago, I had great confidence in my C++ programming skills. Back in school days, I saw no reason to use a compiler to check for errors and I'd pride myself for that. Years went by and one day, long after I had distanced myself from ```#include```, I was trying to solve a simple problem. And I sucked. Sucked bigtime. Sucked so badly, I didn't even know you could declare arrays with variables for size. I was a little taken aback.
<!--break-->

On top of it was the realization that you could have functions in ```structures```. Shock in my face didn't have words in any language known to man.

My logical abilities had gotten pretty bad. I should try to improve them. But, being bad in C++ had seemed the most worrisome problem. And I set out to look for options to get back my ways with language. That was when I stumbled upon Ira Pohl's course in Coursera - [CPP for C Programmers](https://www.coursera.org/course/cplusplus4c). Though I knew some C++ and I never really started out with C as against the intended audience, this course as I see now is more of a 'What-CPP-Is-Really-Capable-Of' kind that helps people who come from any background, whatsoever.

Below are my notes, that are not "complete" by any means. But, I point out certain salient features of the language that most of us usually tend to miss. And since this course addresses too many things at once, I am thinking of doing this part by part.

The post is fairly long and I suggest you slap your cheeks to make sure you really get your focus back. Come, let's jump right in!

* [TypeCasting](#typecasting-in-c)
* [Static Asserts](#staticasserts-in-c)

### TypeCasting in C++

For the ones who come with a classic C background, your idea of typcasting may have only been like this.

```cpp
int a = 2;
float b = (float) a;
```

Apart from the *c-like* syntax as seen above, there is another *functional* typecasting that goes like this.

```cpp
int a = 2;
float b = float(a);
```

There is not much difference between either methods. It is totally up to the user to choose his/her preferred way although many would [prefer to use the latter](http://stackoverflow.com/a/3487099).

Sure, it works if you know what you are doing. But the methods above are so powerful that you can typecast literally any type to another type. Consider this example.

```cpp
//wrong_type_casting.cpp
#include <iostream>

using namespace std;

struct A{
	float a;
};

struct B{
	int b;
};

int main(){
	A a;
	a.a=1;
	B* b = (B*) &a;
	cout<<b->b;
}
```

This would perfectly compile to an executable. Only that the output here may be some junk or in somecases, may create some runtime error.

The problem again is the kind of typecasting we perform. C++ allows for more safer methods to implement the same.

* ```static_cast```
* ```dynamic_cast```
* ```reinterpret_cast```
* ```const_cast```

The syntax for each of the casts is

```cpp
type1 variable = anytypeof_cast<type1>(type2 variable);
```

#### ```reinterpret_cast```
The most dumbass typecast ever. It doesn't check which is pointing to what. You could even typecast an integer pointer to a class pointer that you have defined. It is absolutely dangerous at all levels and its highly recommended that you avoid it.

For example, the same example above can be achieved via ```reinterpret_cast``` as

```cpp
#include <iostream>
using namespace std;

struct A{
	float a;
};

struct B{
	int b;
};

int main(){
	B b;
	b.b=1;
	A* a = reinterpret_cast<A*>(&b);
	cout<<a->a;
}
```

#### ```static_cast```

Now, ```static_cast``` is a little better than the ```reinterpret_cast``` in that, it checks during compile time to see if the values in the LHS and the RHS both match to the same value. The same example above would have been impossible with ```static_cast```.

To really understand what and what is not possible with ```static_cast```, let's start with something simple.

```cpp
float a = 2.34;
int b = static_cast<int>(a); //int b=a;

int a = 10;
float b = static_cast<float>(a); //float b=a;
```

The above code would be possible with ```static_cast```. In general, ```static_cast``` allows for conversions that can happen implicitly.

Now consider the code below.

```cpp
float *a = new float(2.34);
int* b = (int*)a;

int* a = new int(10);
float* b = (float*)a;
```

We have changed nothing except that we declare the variables dynamically. The above code would compile and execute. But the output would not be what we expect. Implementing the same with ```static_cast``` would not let us compile the code at all.

```cpp
float *a = new float(2.34);
int* b = static_cast<int*>(a);

int* a = new int(10);
float* b = static_cast<float*>(a);
```

This code above does not get compiled at all, thus throwing an error.

From what we observe, the problem is with pointer conversion. One type of pointer cannot be converted to another type. But, don't bury that thought deep down. Let's explore a little more before we jump into making any conclusion.

Again, consider the following code.

```cpp
#include <iostream>
using namespace std;

struct A{
	float a;
};

struct B {
	int b;
};

int main(){
	A* a = new A;
	B* b = (B*)a;
}
```

Though totally senseless, this would compile perfectly in C++. Let's attempt the same with ```static_cast```.

```cpp
#include <iostream>
using namespace std;

struct A{
	float a;
};

struct B {
	int b;
};

int main(){
	A* a = new A;
	B* b = static_cast<B*>(a);
}
```

This code throws an error.

```
static_cast.cpp:14:26: error: invalid static_cast from type ‘A*’ to type ‘B*’
  B* b = static_cast<B*>(a);
```

Let's change it a bit making ```B``` a derivative of class ```A```.

```cpp
struct A{
	float a;
};

struct B : public A {
	int b;
};

int main(){
	A* a = new A;
	B* b = static_cast<B*>(a);
}
```

It works!

> Can you see that we are trying to typecast a baseclass pointer into a derived class pointer?

But, hang on! Let us try to do just the opposite : **Typecast a derived class pointer to a base class**.

```cpp
struct A{
	float a;
};

struct B : public A {
	int b;
};

int main(){
	B* b = new B;
	A* a = static_cast<A*>(b);
}
```

Works again!

What it means is that ```static_cast``` for pointers works only if the destination and the source pointer types have a subtype relation to one another - be it fundamental data types like ```int, float, double``` etc or user defined data types.

Thus, ```static_cast``` can perform both pointer upcasts (*pointer-to-base from pointer-to-derived*) and downcasts (*pointer-to-derived from pointer-to-base*).

#### Conclusion

The conclusion we derive with regard to the ```static_cast``` is that:

* **Non pointer typecast**: ```static_cast``` allows for any kind of implicit conversion.

> **Remember** - For user defined classes, the source and destination datatypes must have a relationship to be able to perform an implicit conversion.

* **Ponter typecasts**: The source and destination pointers should have a relationship.

#### Problem with ```static_cast```

Although this seems better than ```reinterpret_cast```, the problem with ```static_cast``` is that it does not check if the object being converted is a "complete" object of the destination type. It is [solely the responsibility of the programmer](http://www.cplusplus.com/doc/tutorial/typecasting/#static_cast "Reference from CPlusPlus.com") to make sure that the conversion is safe.

Consider the code below.

```cpp
#include <iostream>
using namespace std;

struct A{
	float a;
};

struct B : public A {
	int b;
};

int main(){
	B* b = new B;
	b->b=10;
	A* a = static_cast<A*>(b);
	cout<<a->a;
}
```

This code would compile OK. But the output is definitely not ```10``` or ```10.<something>```.

How do we handle such problems? There comes ```dynamic_cast``` into picture.

### ```dynamic_cast```

Now, before we get to the complex parts of this typecasting technique, let us analyze this from the very basics.

Look at the code below.

```cpp
int a=2;
float b=10.78;
a = dynamic_cast<int>(b);

int a=2;
float b=10.78;
b = dynamic_cast<float>(a);
```

Both of the conversions above would be impossible to do with ```dynamic_cast```.

Now, over to pointer type experiments.

```cpp
#include <iostream>
using namespace std;

struct A{
	float a;
	virtual ~A(){} // We are making the class A polymorphic.
};

struct B : public A {
	int b;
};

int main(){
	A *a = new A; // Base pointer for Base object
	A *b = new B; // Base pointer for Derived object

	B *c;

	c = dynamic_cast<B*>(a); //Pointer downcast
	if(!c)
	cout<<"\nFailed for Base object to Derived pointer";

	c = dynamic_cast<B*>(b); //Pointer downcast
	if(!c)
	cout<<"\nFailed for Derived object to Derived pointer";
}
```

Observe the output below.

```
$ g++ dynamic_cast.cpp
$ ./a.out
Failed for Base object to Derived pointer
$
```

#### Conclusion

The thing is here is that, ```dynamic_cast``` compiles even if it is not able to give us the result we want. But, it fails during runtime --> **More safer** than ```static_cast```.

And it allows for pointer downcast of polymorphic classes (*Base class pointer to Derived class pointer*) **only if** the pointed object is a valid object of the target type.

### ```static_asserts``` in C++

The ```static_assert``` is used to declare conditions(assertions) without which program compilation simply won't happen. The usage of ```static_assert``` may not be glaringly obvious at the first glance.

But, we'll try to find out what its for.

The syntax of ```static_assert``` is,

```cpp
static_assert(constant_expression, error_message)
```

Let's take up a dumb example for starters.

```cpp
#include <iostream>
using namespace std;

main(){
	const int a=10;
	static_assert(a>10,"Value has to be greater than 10");
}
```

The output of the program above will be,

```
$ g++ --std=c++11 static_assert.cpp && ./a.out
static_assert.cpp: In function ‘int main()’:
static_assert.cpp:6:2: error: static assertion failed: Value has to be greater than 10
  static_assert(a>10,"Value has to be greater than 10"
```

The same can be used within a ```class``` definition as well.

So, as we can see, we can give custom assert conditions for verification at compile time. But, what good is it if we can only check for ```const``` expressions? When and how do we actually put this to good use?

#### Use Case 1: To check your runtime environment

Imagine you have built a C++ codebase that should work only when ```int``` values take up 4 bytes. You can setup an assertion as below.

```cpp
# include <iostream>
using namespace std;

static_assert(sizeof(int)==4,"Integer size != 4 bytes");

int main(){
	int a=10;
}
```

#### Use Case 2: To check up datatypes when you work with templates

Imagine that for some reason, you only want to print integer values. The assertion for same can be provided like this.

```cpp
#include <iostream>
#include <type_traits>
#include <array>
using namespace std;

template<class T>
void int_display(T a){
	static_assert(is_integral<T>::value,"Not an integer value");
	cout<<a;
}

int main(){
	float a=2.33;
	int b=1;
	int_display(a);
	int_display(b);
}
```

Here, the value is checked with constructs provided by ```type_traits``` header. The output of this example will again be,

```
$ g++ -std=c++11 template_static_assert.cpp
template_static_assert.cpp: In instantiation of ‘void int_display(T) [with T = float]’:
template_static_assert.cpp:15:15:   required from here
template_static_assert.cpp:8:2: error: static assertion failed: Not an integer value
  static_assert(is_integral<T>::value,"Not an integer value");
```

These are two use cases that I could think of for ```static_asserts```.

---
There are many more awesome stuff in the course. But more on that, next time! Let me know if something's not what it should be in the comments section below.
