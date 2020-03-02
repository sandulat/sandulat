---
title: Testing Laravel Vapor file uploads
date: '2020-02-27'
description: In this post I'll cover file upload testing for apps running on Vapor, since there is no official documentation on how to do it.
featuredImage: featured-image.png
---

Testing classic file uploads, that are submitted directly to the server, in Laravel is extremely simple, as you can see in the example below:

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function testFileUpload()
    {
        Storage::fake();

        $response = $this->json('POST', '/avatar', [
            'file' => UploadedFile::fake()->image('photo.jpg'),
        ]);

        Storage::assertExists('photo.jpg');
    }
}
```

However if you're are running your Laravel app on Vapor, you might know that files are never sent directly to your backend. Instead, users upload files directly to S3, into a `tmp` folder (which is configured to purge any files older than 24 hours) and just send the S3 file path to your backend for further processing.

After receiving the S3 file path in your API, you can move the file out of the `tmp` directory:

```php
use Illuminate\Support\Facades\Storage;

Storage::copy(
    $request->input('key'),
    str_replace('tmp/', '', $request->input('key'))
);
```

### Simulating S3 Direct Uploads in Tests

Since we have no S3 in our tests, we can place the files directly on our local system by using `\Illuminate\Support\Facades\Storage::putFile()` which in a testing environment will store files in `storage/framework/testing/disks/local`. This folder is also automatically purged each time you run your tests.

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function testFileUpload()
    {
        Storage::fake();

        $file = UploadedFile::fake()->image('photo.jpg');

        $filePath = Storage::putFile('tmp', $file);

        $response = $this->json('POST', '/avatar', [
            'key' => $filePath,
        ]);

        Storage::assertMissing($filePath);

        Storage::assertExists($file->hashName());
    }
}
```

As you can see, we've stored the file in a local `tmp` folder and sent its path to the API (just like we would store it on S3). Finally, we can test that the file was moved out of the `tmp` folder.

---

Thank you for reading this post! Subscribe below and get notified when new posts will be released or follow me on [Twitter (@sandulat)](https://twitter.com/sandulat). 
