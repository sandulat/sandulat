---
title: Validating Laravel Vapor file uploads
date: '2020-02-27'
description: In this post you'll find out to how to define a reusable validation rule for direct S3 file uploads.
featuredImage: featured-image.png
emoji: 👀
---

In Laravel apps running on Vapor, users upload files directly to S3, after which the stored file path is sent to our API. Before moving out the files from the `tmp` folder, we have to make sure that:

- The path represents the `tmp` folder.
- The file exists.
- It doesn't exceed the size limit.
- It has a valid mime type.

Such validations with classic file uploads, which are sent directly to our API, can be easily done with default Laravel rules like `mimes` and `size`. However, since we are receiving an S3 path now, we'll have to define a reusable validation rule:

```php
<?php

declare(strict_types=1);

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StorageFile implements Rule
{
    public int $maxSize;

    /** @var string[] */
    public array $mimes;

    /**
     * @param int $maxSize
     * @param string[] $mimes
     */
    public function __construct(int $maxSize, array $mimes)
    {
        $this->maxSize = $maxSize;

        $this->mimes = $mimes;
    }

    /**
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        if (! Str::startsWith($value, 'tmp/')) {
            return false;
        }

        if (! Storage::exists($value)) {
            return false;
        }

        if (Storage::size($value) > $this->maxSize) {
            return false;
        }

        return in_array(Storage::mimeType($value), $this->mimes);
    }

    public function message(): string
    {
        return 'Invalid file.';
    }
}
```

In this example, the `StorageFile` rule receives the allowed max file size and mime types.

### Rule Usage

This is a basic Laravel rule, so it can be used as any other rule in your validators:

```php
Validator::make($request->all(), [
  'key' => [
    'required',
    new StorageFile(5120, ['image/jpg', 'image/jpeg', 'image/png'])
  ],
]);
```

Or alternatively in `FormRequest`:

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Rules\StorageFile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FileUploadRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'key' => [
                'required',
                new StorageFile(5120, ['image/jpg', 'image/jpeg', 'image/png']),
            ],
        ];
    }
}
```

---

Thank you for reading this post! Subscribe below and get notified when new posts will be released or follow me on [Twitter (@sandulat)](https://twitter.com/sandulat).
