# Changelog

## l20n 5.0.0

Starting with this release, `l20n` is built on top of Project Fluent. `l20n`
combines Project Fluent's APIs and packages to create a complete solution for
localizing HTML documents.

L20n.js makes use of the following Fluent packages:

  - `fluent` which exposes the `MessageContext` class responsible for parsing
    translations stored in FTL files and formatting them,
  - `fluent-langneg` which provides a modern language negotiation logic,
  - `fluent-intl-polyfill` which ships with an implementation of
    `Intl.PluralRules`.

All of these packages are bundled in the `l20n.js` script and there's no need
to include them explicitly.

In previous versions of `l20n` there were two directories, `dist/bundle/web`
and `dist/compat/web` containing the original and the transpiled builds
respectively.  `l20n` is now transpiled using Babel's Latest preset by default.
There is also a minified build available, `l20n.min.js`.  Both files can be
found in `dist/web`.

As of this release (v5), the version of `fluent` used is `0.3.1`.  There are a few
updates to the syntax compared to `l20n` v4:

  - Multiline text is now simply indented and doesn't require the pipe `|`
    prefix. See http://projectfluent.io/fluent/guide/text.html.

    Before:

        hello-world =
            | This multiline message spans
            | two lines of text.

    Now:

        hello-world =
            This multiline message spans
            two lines of text.

  - Attributes are now written using the dot `.` prefix instead of the square
    brackets. The placement of the equals sign `=` is also different. See
    http://projectfluent.io/fluent/guide/attributes.html.

    Before:

        hello-world =
            [html/title] Hello, world!

    Now:

        hello-world
            .title = Hello, world!

  - Comments are now written with the double forward slash `//` prefix instead
    of the hash `#`.  See http://projectfluent.io/fluent/guide/comments.html

    Before:

        # A comment
        hello-world = Hello, world!

    Now:

        // A comment
        hello-world = Hello, world!

  - Select expressions must now define the default variant. The whole body of
    the expression must be intended too (we might lift this requirement in the
    future). See http://projectfluent.io/fluent/guide/selectors.html.

    Before:

        emails = { $unreadEmails ->
            [one] You have one unread email.
            [other] You have { $unreadEmails } unread emails.
        }

    Now:

        emails = { $unreadEmails ->
                [one] You have one unread email.
               *[other] You have { $unreadEmails } unread emails.
            }

    Or:

        emails =
            { $unreadEmails ->
                [one] You have one unread email.
               *[other] You have { $unreadEmails } unread emails.
            }

  - Traits were removed in favor of attributes (see above) and variants known
    from select expressions. See
    http://projectfluent.io/fluent/guide/variants.html

    Before:

        brand-name =
            *[nominative] Aurora
             [genitive] Aurore

        about = O { brand-name[locative] }

    Now:

        brand-name =
            {
                *[nominative] Aurora
                 [genitive] Aurore
            }

        about = O { brand-name[locative] }
