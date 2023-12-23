<script lang="ts">
  interface Preset {
    arg: string;
    comment: string;
  }

  const array: Preset[] = [
    { arg: "astro", comment: "Use with Astro!" },
    { arg: "nextjs", comment: "Use with Next.js" },
    { arg: "cra", comment: "Use with Create React App" },
    { arg: "vite", comment: "Use with Vite" },
    { arg: "cra", comment: "Use with Create React App" },
  ];

  let index = 0;
  let item: Preset = array[index];
  let hovered = false;

  setInterval(() => {
    if (hovered) return;
    index++;
    if (index >= array.length) index = 0;
    item = array[index];
  }, 1500);

  const hoverIn = () => (hovered = true);
  const hoverOut = () => (hovered = false);
</script>

<div on:mouseenter={hoverIn} on:mouseleave={hoverOut}>
  <div class="text-gray-300"># {item.comment}</div>
  npm init firemyna --preset {item.arg}
</div>
