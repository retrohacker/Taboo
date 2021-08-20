# Taboo

Taboo lets you see what is being shared on the BitTorrent DHT. It's fully local. You aren't talking to a Taboo server or anything, just talking directly to the DHT.

> Note: I AM NOT A LAWYER! To my knowledge, there aren't any other systems doing this that you can run on your laptop. I suspect the nuance of how Taboo works isn't going to be appreciated by your local law enforcement. If you don't want to test the legality of Taboo in court, I'd strongly recommend either: running a VPN (less safe) or not using Taboo (most safe). If you want to use Taboo with a VPN, may I suggest putting some money in an envelope and sending it to [Mullvad](https://mullvad.net/en/pricing/)?

# How it works

Taboo spins up a bunch of DHT nodes. If you don't know what the DHT is, it's how torrent clients can find other torrent clients that have content, without needing a central server. It kinda works like a trade floor, pre-computers. A bunch of people all sit togther in a room and announce that they're either looking to buy or sell a thing. Everyone in the room has a social network of friends. When they get a "buy" order, they ask their friends if they know anyone selling. Over time, folks get a good idea of the "direction" a particular "buy" order should be sent to.

What Taboo does is pretty simple. Whenever someone says they are trying to "sell" (seed) something on the trade floor, Taboo tries to buy (download) it.

In BitTorrent terminology, whenever a peer on the DHT announces an infoHash, Taboo starts downloading the torrent just long enough to resolve the infoHash's metadata and then immediately stops downloading. That resolved metadata is what populates the UI.

# Philosophy

> The most frightening realization hit me: there wasn't any reason behind what I'd done. I mean, I knew why I'd done it - I just did it because it would be _fun_. But I knew they would ask, "Why the hell did you do this?" and if I didn't have a good enough reason, they would probably throw me into a mental institution." -- Boyd Rice

In retrospect, I can come up with a lot of reasons why Taboo is useful. But none of those were the motivation for building this. I built it because it would be _fun_. I read the [kademlia research paper](https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf), and I thought to myself "if folks are announcing what they want, and what they have, why couldn't I just ask for those things too?". So I did. And it worked.
