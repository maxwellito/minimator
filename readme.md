# minimator.

_**minima**~~list graphical edi~~**tor**_[^1]

_Horizontal lines, vertical lines, quarter circles and that's it. Try [minimator.app](https://minimator.app)_


## Development

If you're brave enough to run it on your machine, here is the procedure.

```bash
# 1. Install dependencies
npm install

# 2. Run the build
npm start

# 3. Serve the repository over HTTP
# In another window, please run one of the following
python3 -m http.server     # For python3
python -m SimpleHTTPServer # For python2
http-server -p 8000        # For NPM pkg http-server

# 4. Go to http://localhost:8000
```

To add tests, import it in `src/tests/list.ts` then check the console in http://localhost:8000/dev.html

## FAQ (aka, tell my life to strangers)

### Why is there no proper build system?

Because the TypeScript compiler and modern web features (webcomponents, imports, css variables) are enough to build a nice app. No need to bloat this tiny thing. Of course it's not super optimised in terms of load speed, but let's enjoy the benefits of modern HTTP.

### Why rewrite a test runner?

Because I wanted to have a tiny thing to run a few basic tests at a time when I had no internet. Mostly for fun and the challenge. I am aware it's absolutely pointless, but the plan was to switch to an established library hence the API is similar.

I mean I know it's weird but it was fun to build everything. Frameworks are great and are definitely more optimised and tested.

### Why is this for free?

I wanted to build a graphical editor for tablet first, as enjoyable (gesture-wise) as Procreate. The end-goal would have been a way to push it to a plotter to print creations. I was considering having a donate button to buy a big plotter and print the best creations to send them to donators. But I don't believe one second this project would make enough bucks to buy a tiny A4 plotter, plus I'm not sure about how to declare this to HMRC so I'll pass on that.

However, as for most of my projects, it's for my own pleasure first. If it's fun enough for other people: that's great but not the goal.

It took me a while to finish this project. Not because of time or motivation, but because I was playing with it too much during the development process. Just for that, this project met the original requirements: _having fun_.

---

[^1]: minimalist is also an excuse to explain the lack of features that I'm too lazy to implement.