This folder is where all the re-usable building blocks of YBTV live. Ideally,
YBTV is nothing more than a bunch of these components glued together.

Components that begin with an underscore like the `_carousel` component are not
actual components themselves; they are "abstract" in that they can be used to
generate other components. In this example, all other types of carousels like
the `hero-carousel` and `companion-carousel` both build off of `_carousel`.
