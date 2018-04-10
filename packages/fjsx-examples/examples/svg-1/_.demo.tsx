var viewSvg = (
  <div>
    <div>foo</div>
    <svg width="100%" height="500">
      <rect x="10" y="10" width="100" height="150" fill="blue" />
      <foreignObject x="10" y="10" width="100" height="150">
        <div>
          Here is a <strong>paragraph</strong> that requires <em>word wrap</em>
        </div>
      </foreignObject>

      <circle cx="200" cy="200" r="100" fill="red" />
      <foreignObject x="120" y="120" width="180" height="180">
        <div>
          <ul>
            <li>
              <strong>First</strong> item
            </li>

            <li>
              <em>Second</em> item
            </li>
            <li>Thrid item</li>
          </ul>
        </div>
      </foreignObject>
    </svg>
  </div>
);

document.body.appendChild(viewSvg);
