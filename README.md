Trill
=====

Trill is a libraries layer and CLI tool to process URLs for information that is potentially useful in sales campaigns. It is designed with [Growbots](https://www.growbots.com/) in mind.

With Trill you can...

*   Process a CSV of URLS
*   Determine the platform (eg Drupal, WordPress or Node) of a site
*   Determine the SEO score of a site
*   Determine the page speed of a site
*   Easily customize or extend processing or file formats with simple plugins.

Installation
------------

Use one of our [prebuilt binaries](https://github.com/thinktandem/trill/releases) to install. If you are interested in developing Trill see the Development section below.

```bash
# Make sure you are using the correct platform and version
sudo curl -fsSL -o /usr/local/bin/trill "https://github.com/thinktandem/trill/releases/download/v1.0.0-alpha.3/trill-v1.0.0-alpha.3"
sudo chmod +x /usr/local/bin/trill

# Run trill
trill
```

Usage
-----

```bash
Usage: trill <command> [args] [options] [-- global options]

Commands:
  config          Display the trill configuration
  process <file>  Processes the csv file
  version         Display the trill version

Global Options:
  --help, -h  Show help
  --verbose, -v, -vv, -vvv, -vvvv  Change verbosity of output

You need at least one command before moving on
```

### Basic Examples

```bash
# Run config with verbose mode
trill config -- -vv

# Get help on process command
trill process -- --help
```

### Process

**Usage**

`trill process <file>`

**Options**

```bash
  --timeout, -t      Specify the length of the ping timeout in milliseconds [number] [default: 8000]
  --retry, -r        Specify the amount of ping retries    [number] [default: 3]
  --concurrency, -c  Specify the ping process concurrency [number] [default: 50]
  --platform, -p     Accept only the platforms specified [array] [choices: "drupal", "wordpress", "mean"]
```

Development
-----------

**Using Lando**

Make sure you've installed [Lando](http://github.com/lando/lando) first.

```bash
# Clone the project
git clone https://github.com/thinktandem/trill.git
cd trill

# Install dependencies
lando npm install

# Run trill
lando trill
```

Note that if you've installed with `lando` then you will want to prefix all the example commands below with `lando` eg `lando grunt pkg`.

**Without Lando**

This is trickier to setup but can offer faster performance. Make sure you've installed [NodeJS 8](http://nodejs.org).

```
# Clone the project
git clone https://github.com/thinktandem/trill.git
cd trill

# Install dependencies
npm install

# Symlink the entrypoint
sudo ln -s /path/to/repo/bin/trill.js /usr/local/bin/trill

# Run trill
trill
```

Testing
-------

You can run some tests locally.

```bash
# Check code standards
grunt test:code
```

Building
--------

You can package up a release.

```bash
# Compile into a binary
grunt pkg

# Find the result
cd dist && ls -lsa
```

Deploying A Release
-------------------

You can tag and deploy various releases.

```bash
# Do a prerelease ie bump 0.0.0-beta.x
grunt prerelease --dry-run
grunt prerelease

# Do a patch release ie bump 0.0.x
grunt release --dry-run
grunt release

# Do a minor release ie bump 0.x.0
grunt bigrelease --dry-run
grunt bigrelease
```

Other Resources
---------------

* [Mountain climbing advice](https://www.youtube.com/watch?v=tkBVDh7my9Q)
