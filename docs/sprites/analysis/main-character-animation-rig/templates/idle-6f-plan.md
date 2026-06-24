# Idle 6-frame plan

Canvas: 64×80. FPS: 8.

| frame | torso | head | tail | notes |
| --- | --- | --- | --- | --- |
| 0 | y 0 | y 0 | neutral | base |
| 1 | y 0 | y -1 | tip +1px | inhale starts |
| 2 | y -1 | y -1 | tip +2px | highest body |
| 3 | y -1 | y 0 | tip +1px | settle |
| 4 | y 0 | y 0 | neutral | base |
| 5 | y 0 | y 0 | tip -1px | tiny tail overshoot |

Keep feet planted on baseline y=76. Blink can be a separate `face-features` overlay variant.
