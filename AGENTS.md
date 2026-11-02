<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep mobile rendering policy in `src/lib/scene-quality.ts` with focused tests; Scene3D uses demand rendering, instanced clusters, and stops drawing idle phone/hidden/reduced-motion scenes to protect scrolling performance.
- Scene development metrics are exposed on its wrapper as `data-draw-calls`, `data-triangles`, `data-frames`, and `data-pixel-ratio`; use them to verify workload without mistaking software-rendered sandbox FPS for device performance.
- Construct Three.js host elements through `threeElement` rather than JSX; it strips DOM-only data attributes so preview source tagging cannot reach R3F's property reconciler. Keep ordinary DOM markup as JSX for preview inspection.
