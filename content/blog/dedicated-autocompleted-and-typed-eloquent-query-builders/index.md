---
title: Dedicated, autocompleted and typed Eloquent query builders
date: '2020-04-04'
description: Wouldn't it be cool if Laravel's query builder had autocomplete? Let's explore how we can achieve this with dedicated query builders.
featuredImage: featured-image.png
emoji: ⚡️
---

Before we start, this article was heavily inspired by [Tim MacDonald's](https://twitter.com/timacdonald87) article ["Dedicated query builders for Eloquent models"](https://timacdonald.me/dedicated-eloquent-model-query-builders/). You should definitely check it out.

---

Wouldn't it be cool if Laravel's query builder had autocomplete? Even on deep relationship queries? We can achieve this with dedicated query builders.

### Our first dedicated query builder

Let's define a new `UserBuilder`, which will extend Eloquent's base query builder:

```php
<?php

declare(strict_types=1);

namespace App\Builders;

use Illuminate\Database\Eloquent\Builder;

final class UserBuilder extends Builder
{
    public function whereName(string $name): self
    {
        return $this->where('name', $name);
    }
}
```

Notice how we've defined a custom `whereName` method? All the methods that we're defining in our custom query builder will be basically simple wrappers around Eloquent's query builder methods.

### Linking our custom query builder with the model

Eloquent models have a `newEloquentBuilder` method under the hood, which by default returns the base query builder. We can link our custom query builder with the desired model by overriding this method:

```php
<?php

declare(strict_types=1);

namespace App;

use App\Builders\UserBuilder;
use Illuminate\Foundation\Auth\User as Authenticatable;

final class User extends Authenticatable
{
    public function newEloquentBuilder($query): UserBuilder
    {
        return new UserBuilder($query);
    }
}
```

Great! Now we can use the whole thing like this:

```php
User::whereName('Alex')->first();
```

But unfortunately, our IDE will not provide autocomplete, since it can't recognize our custom query builder just by overriding the `newEloquentBuilder` method.

To get autocomplete working, we'll have to type hint the return type of the `query` method, available in Eloquent models.

```php
<?php

declare(strict_types=1);

namespace App;

use App\Builders\UserBuilder;
use Illuminate\Foundation\Auth\User as Authenticatable;

final class User extends Authenticatable
{
    /**
     * @return \App\Builders\UserBuilder|\Illuminate\Database\Eloquent\Builder
     */
    public static function query()
    {
        return parent::query();
    }

    public function newEloquentBuilder($query): UserBuilder
    {
        return new UserBuilder($query);
    }
}
```

Now, to get static analysis working, we'll have to start all our queries with the `query` method:

```php
User::query()->whereName('Alex')->first();
```

### Static analysis on relationship queries

Let's define a new `Article` model:

```php
<?php

declare(strict_types=1);

namespace App;

use App\Builders\ArticleBuilder;
use Illuminate\Database\Eloquent\Model;

final class Article extends Model
{
    /**
     * @return \App\Builders\ArticleBuilder|\Illuminate\Database\Eloquent\Builder
     */
    public static function query()
    {
        return parent::query();
    }

    public function newEloquentBuilder($query): ArticleBuilder
    {
        return new ArticleBuilder($query);
    }
}
```

And a new `ArticleBuilder` for our `Article` model:

```php
<?php

declare(strict_types=1);

namespace App\Builders;

use Illuminate\Database\Eloquent\Builder;

final class ArticleBuilder extends Builder
{
    public function wherePublished(bool $published): self
    {
        return $this->where('published', $published);
    }
}
```

Let's assume that our `User` model has many articles, so let's define a `HasMany` relationship:

```php
<?php

declare(strict_types=1);

namespace App;

use App\Builders\UserBuilder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class User extends Authenticatable
{
    /**
     * @return \App\Builders\UserBuilder|\Illuminate\Database\Eloquent\Builder
     */
    public static function query()
    {
        return parent::query();
    }

    public function newEloquentBuilder($query): UserBuilder
    {
        return new UserBuilder($query);
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
```

Now, by building a query from an user's articles relationship, we won't get any autocomplete, since the `articles` relationship method returns an `Illuminate\Database\Eloquent\Relations\HasMany` instance:

```php
User::articles()->??????->first();
```

To solve this, we can also type hint the return type of the `articles` relationship method:

```php
/**
  * @return \App\Builders\ArticleBuilder|\Illuminate\Database\Eloquent\Relations\HasMany
  */
public function articles()
{
    return $this->hasMany(Article::class);
}
```

And we've solved the problem:

```php
User::articles()->wherePublished(true)->first();
```

### Static analysis on "whereHas" queries

What if we want to retrieve all the users, which have published articles only? Normally we'd do it like this:

```php
User::whereHas('articles', function ($query) {
    $query->where('published', true);
})->get();
```

However, since we are moving away from the classic query building, we're going to define a `whereHasArticles` method on our `UserBuilder`:

```php
public function whereHasArticles(\Closure $callback = null): self
{
    return $this->whereHas('articles', $callback);
}
```

Which will be used like this:

```php
User::query()
  ->whereHasArticles(fn(ArticleBuilder $query) => $query->wherePublished(true))
  ->get();
```

### Static analysis on "with" queries

To retrieve all the users with their published articles only, this is what we'd normally do:

```php
User::with([
    'articles' => function ($query) {
        $query->where('published', true);
    },
])->get();
```

But, we'll define a custom `withArticles` method in our `UserBuilder`:

> Keep in mind that the `with` query closures will inject instances of relationships, like `HasMany` in our case. Fortunately, relationship instances provide a `getQuery` method, which will return our dedicated query builder.

```php
public function withArticles(\Closure $callback = null): self
{
    return $this->with([
        'articles' => fn(HasMany $query) => $callback ?
            $callback($query->getQuery()) :
            $query,
    ]);
}
```


The method can be used like this:

```php
User::query()
  ->withArticles(fn(ArticleBuilder $query) => $query->wherePublished(true))
  ->get();
```

### Caveat: multi-where scopes

Read about this caveat on [Tim MacDonald's](https://twitter.com/timacdonald87) article ["Dedicated query builders for Eloquent models"](https://timacdonald.me/dedicated-eloquent-model-query-builders/).

### Wrapping up

I've showed how you can type hint your `with` / `whereHas` closures, but it can also be applied to basically all types of queries, like `whereHasMorph`, and so on.

I do really enjoy this approach, since I'm always trying to get static analysis working everywhere and I believe that this approach is the only one available out there to get it working with Eloquent and to eliminate the magic. It's extremely helpful once your team grows or projects get larger, at least in my humble opinion.

---

Thanks for reading this post! Subscribe below and get notified when new posts will be released. Also, let me know on [Twitter (@sandulat)](https://twitter.com/sandulat) what do you think about this approach.
