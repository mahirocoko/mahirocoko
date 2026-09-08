# Results: Astra effort vs Sol High

## Revealed outcome

| Configuration | Easy | Medium | Hard | Weighted | Elapsed total | Approx. context used |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Astra Low | 100 | 100 | 93.64 | **96.82** | **328.8s** | **92.2K** |
| Astra Medium | 100 | 100 | 93.64 | **96.82** | 404.2s | 100.7K |
| Astra High | 100 | 100 | 93.64 | **96.82** | 503.6s | 109.9K |
| Sol High | 100 | 53.33 | 16.36 | 44.18 | 461.8s | 101.6K |

Weighted score uses Easy 20%, Medium 30%, and Hard 50%.

## Per-task elapsed time

| Configuration | Easy | Medium | Hard |
| --- | ---: | ---: | ---: |
| Astra Low | 65.8s | 123.0s | 140.0s |
| Astra Medium | 98.5s | 133.1s | 172.6s |
| Astra High | 82.4s | 207.2s | 214.0s |
| Sol High | 216.2s | 158.8s | 86.8s |

Sol's short Hard time is not a speed win: it stopped at a design-confirmation gate without editing the source. It did the same on Medium. No extra confirmation was sent because that would give one configuration a different prompt budget.

## What separated the configurations

- All Astra effort levels independently achieved identical correctness on this sample.
- Astra Low used 18.6% less elapsed time than Medium, 34.7% less than High, and 28.8% less than Sol High in total.
- Astra Low also had the smallest rounded context footprint.
- All three Astra outputs missed the same clear Hard requirement: nested `data` remained aliased, violating the fresh canonical-object contract.
- Sol High passed Easy, then followed the globally installed brainstorming workflow strictly enough to request design approval before writing on Medium and Hard. The other configurations implemented directly under the same local configuration.

## Bounded routing conclusion

For clear, bounded implementation in Mahiro's current interactive Direct CLI workflow:

1. **Use Astra Low by default.** It matched Medium and High quality while finishing fastest and using the least context in this sample.
2. **Escalate only after evidence.** Medium and High showed no quality gain here. Use them when ambiguity, architecture risk, or a failed Low hypothesis justifies the extra cost.
3. **Do not treat Sol High as the autonomous bounded-writer default under the current plugin/rule stack.** Its confirmation-gate behavior prevented completion on two of three tasks.

This does not prove Astra Low is universally better than Sol High as a base model. A base-model comparison would need a separate clean run with user rules/plugins disabled, randomized dispatch order, stronger OS isolation, and repeated trials.
