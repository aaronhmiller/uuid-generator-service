interface UUIDv1Options {
  node?: number[];    // 48-bit node id (optional)
  clockseq?: number;  // 14-bit clock sequence (optional)
  msecs?: number;     // Time in milliseconds since unix epoch
  nsecs?: number;     // Additional 100-ns precision (optional)
}

class UUIDv1Generator {
  private nodeId: number[];
  private clockseq: number;
  private msecs: number;
  private nsecs: number;
  private last: number;

  constructor(options: UUIDv1Options = {}) {
    // Use random node if not provided
    this.nodeId = options.node || Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));
    
    // Use random clock sequence if not provided
    this.clockseq = options.clockseq !== undefined ? options.clockseq : Math.floor(Math.random() * 16384);
    
    // Initialize time components
    this.msecs = options.msecs || new Date().getTime();
    this.nsecs = options.nsecs || 0;
    this.last = 0;
  }

  public generate(): string {
    let msecs = this.msecs;
    let nsecs = this.nsecs;
    const now = new Date().getTime();

    if (now > msecs) {
      msecs = now;
      nsecs = 0;
    } else if (now === msecs) {
      nsecs++;
      if (nsecs >= 10000) {
        msecs++;
        nsecs = 0;
      }
    }

    this.msecs = msecs;
    this.nsecs = nsecs;
    this.last = now;

    // Convert to Unix timestamp to Gregorian epoch (00:00:00.000 15 Oct 1582)
    const uuidTime = (msecs + 12219292800000) * 10000 + nsecs;

    // Convert to hexadecimal strings
    const timeHex = uuidTime.toString(16).padStart(16, '0');
    const clockseqHex = this.clockseq.toString(16).padStart(4, '0');
    const nodeHex = this.nodeId.map(b => b.toString(16).padStart(2, '0')).join('');

    // Format UUID v1
    const uuid = `${timeHex.slice(7)}${timeHex.slice(3, 7)}1${timeHex.slice(0, 3)}${clockseqHex}${nodeHex}`;
    
    return uuid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
  }
}

// Example usage:
const uuidGenerator = new UUIDv1Generator();
const uuid = uuidGenerator.generate();
console.log(uuid); // e.g., "2c5ea4c0-4067-11ed-8000-d43c89b79a23"

// With custom options:
const customGenerator = new UUIDv1Generator({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234
});
const customUuid = customGenerator.generate();
