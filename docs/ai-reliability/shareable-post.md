# Shareable Post: AI Reliability Guardrails

This file is the public-facing version of the guardrail idea.

## Draft

> ถ้าใครใช้ Claude หรือ coding assistant อยู่ ผมว่ามีท่าหนึ่งที่ช่วยลดความหลอนได้เยอะพอสมควร คือใส่ global instruction ไว้เลยประมาณนี้:
>
> 1. **Say “I don’t know”** — ถ้าไม่รู้คือไม่รู้ อย่ามั่วเพื่อให้ดูช่วยเหลือ
> 2. **Tool-first, not memory-first** — โดยเฉพาะเรื่องที่ตรวจได้จากไฟล์, repo, config, logs, docs ให้ดู source ก่อน อย่าเอาความจำจากบทสนทนามาเล่าเป็นเรื่องจริง
> 3. **Don’t extend beyond evidence** — แยก fact, inference, speculation ให้ชัด อย่ามโนต่อจาก assumption เดียว
> 4. **Retract immediately** — ถ้ารู้ตัวว่าพูดเกินหลักฐานหรือผิด ให้ถอยและแก้ทันที ไม่ต้องแถต่อ
> 5. **Cite the source** — ถ้าอ้าง facts หรือสรุปจาก docs/tools ช่วยบอก source ด้วย จะตรวจต่อได้ง่ายมาก
>
> ส่วนตัวผมว่า 5 ข้อนี้ไม่ได้ทำให้ AI หายหลอน 100% แต่มันช่วยลด confident nonsense ได้เยอะ โดยเฉพาะงานที่เกี่ยวกับ code, repo state, docs, และ factual reasoning
>
> caveat สำคัญคือ:
> - อย่าเขียน rule จนกลายเป็น “ห้ามคิด”
> - เป้าหมายไม่ใช่ให้มันตอบช้า แต่ให้มันเลิกเดาแบบไม่มีหลักฐาน
> - prompt อย่างเดียวไม่พอ ถ้า workflow มี eval, logging, citation, และ verification ด้วย จะเห็นผลชัดกว่า
>
> อันนี้ผมก็ไม่ได้คิดเองล้วน ๆ นะ เอาของหลายที่มาปรับรวมกันอีกที แต่พอลองใช้แล้วรู้สึกว่าความหลอนลดลงจริง เลยอยากแชร์ เผื่อมีประโยชน์ครับ 🙏

## Suggested Framing

- จุดสำคัญที่สุดไม่ใช่ “ห้ามผิด” แต่คือ “ห้ามมั่วแล้วทำเป็นมั่นใจ”
- ถ้าจะเก็บไว้แค่ประโยคเดียว ให้เก็บประโยคนี้: **Do not present unverified inference as fact.**
- ถ้าจะเน้นพฤติกรรมเดียว ให้เน้น: **Retract immediately.**

## References

- Anthropic, "Reduce hallucinations"  
  https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations
- Anthropic, "Citations"  
  https://platform.claude.com/docs/en/build-with-claude/citations
- OpenAI, "Why language models hallucinate"  
  https://openai.com/index/why-language-models-hallucinate/
- Google Gemini API, "Grounding with Google Search"  
  https://ai.google.dev/gemini-api/docs/google-search
- Simon Willison, "Anthropic's new citations API"  
  https://simonwillison.net/2025/Jan/24/anthropics-new-citations-api/
