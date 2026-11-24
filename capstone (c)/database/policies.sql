-- Public listing access
CREATE POLICY "Public can view active listings"
ON public.items
FOR SELECT
USING (status IN ('Active', 'Under Review', 'Closed'));

-- Profile access
CREATE POLICY "Users can create own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Items policies
CREATE POLICY "Users can insert their own items"
ON public.items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
ON public.items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
ON public.items
FOR DELETE
USING (auth.uid() = user_id);

-- Claims policies
CREATE POLICY "Users can view claims tied to them"
ON public.claims
FOR SELECT
USING (auth.uid() = claimant_id OR auth.uid() = (SELECT user_id FROM public.items WHERE id = item_id));

CREATE POLICY "Users can create claim requests"
ON public.claims
FOR INSERT
WITH CHECK (auth.uid() = claimant_id);

CREATE POLICY "Only admins can update claim status"
ON public.claims
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Admin-only operations
CREATE POLICY "Admins can review all records"
ON public.items
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admins can review all profiles"
ON public.profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);
