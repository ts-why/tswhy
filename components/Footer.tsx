export function Footer() {
  return (
    <footer class="p-6 border-t bg-gray-100 dark:bg-gray-800 flex">
      <div class="flex-auto">
        <span property="dct:title" class="font-header">tswhy?</span>{" "}
        is licensed under{" "}
        <a
          href="http://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"
          target="_blank"
          rel="license noopener noreferrer"
          class="text-blue(600 dark:300) hover:underline"
        >
          CC BY-SA 4.0<img
            class="ml-1 h-6 inline align-bottom"
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
            alt="Create Commons Logo"
          />
          <img
            class="ml-1 h-6 inline align-bottom"
            src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
            alt="Creative Commons Attribution Logo"
          />
          <img
            class="ml-1 h-6 inline align-bottom"
            src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
            alt="Creative Commons Share Alike Logo"
          />
        </a>
      </div>
      <div class="flex-auto">
        <ul class="flex flex-wrap justify-end text-gray-900 dark:text-white">
          <li>
            <a href="/contributing" class="mr-4 hover:underline md:mr-6">
              Contributing
            </a>
          </li>
          <li>
            <a href="/integrating" class="mr-4 hover:underline md:mr-6">
              Integrating
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
