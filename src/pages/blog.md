---
pageTitle: About Us
date: 2019-03-01
navTitle: About Us
pageClass: blog
---

<section>
  {% for post in collections.posts %}
  <article>
    {{ post.templateContent }} {{ post.date | date: "%Y-%m-%d" }}
  </article>
  {% endfor %}
</section>
